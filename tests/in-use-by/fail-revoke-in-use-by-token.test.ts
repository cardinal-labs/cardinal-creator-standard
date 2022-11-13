import { expect, test } from "@jest/globals";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";

import { Ruleset } from "../../sdk";
import { MintManager } from "../../sdk/generated/accounts/MintManager";
import { createApproveInstruction } from "../../sdk/generated/instructions/Approve";
import { createInitializeMintInstruction } from "../../sdk/generated/instructions/InitializeMint";
import { createRevokeInstruction } from "../../sdk/generated/instructions/Revoke";
import { createSetInUseByInstruction } from "../../sdk/generated/instructions/SetInUseBy";
import { findMintManagerId, findRulesetId } from "../../sdk/pda";
import type { CardinalProvider } from "../../utils";
import { executeTransaction, getProvider, tryGetAccount } from "../../utils";

const mintKeypair = Keypair.generate();

const RULESET_NAME = "ruleset-no-checks";
const RULESET_ID = findRulesetId(RULESET_NAME);
const RULESET_COLLECTOR = new PublicKey(
  "gmdS6fDgVbeCCYwwvTPJRKM9bFbAgSZh6MTDUT2DcgV"
);
const IN_USE_BY_AUTHORITY = Keypair.generate();

let provider: CardinalProvider;
let delegate: Keypair;

beforeAll(async () => {
  provider = await getProvider();
  delegate = Keypair.generate();
});

test("Init", async () => {
  const mintManagerId = findMintManagerId(mintKeypair.publicKey);
  const ruleset = await Ruleset.fromAccountAddress(
    provider.connection,
    RULESET_ID
  );
  const targetTokenAccount = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    provider.wallet.publicKey
  );

  const tx = new Transaction();
  tx.add(
    createInitializeMintInstruction({
      mintManager: mintManagerId,
      mint: mintKeypair.publicKey,
      ruleset: RULESET_ID,
      targetTokenAccount: targetTokenAccount,
      target: provider.wallet.publicKey,
      rulesetCollector: ruleset.collector,
      authority: provider.wallet.publicKey,
      payer: provider.wallet.publicKey,
      collector: RULESET_COLLECTOR,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
  );
  await executeTransaction(provider.connection, tx, provider.wallet, [
    mintKeypair,
  ]);

  // check mint
  const mintInfo = await tryGetAccount(() =>
    getMint(provider.connection, mintKeypair.publicKey)
  );
  expect(mintInfo).not.toBeNull();
  expect(mintInfo?.isInitialized).toBeTruthy();
  expect(mintInfo?.supply.toString()).toBe("1");
  expect(mintInfo?.decimals.toString()).toBe("0");
  expect(mintInfo?.freezeAuthority?.toString()).toBe(mintManagerId.toString());
  expect(mintInfo?.mintAuthority?.toString()).toBe(mintManagerId.toString());

  // check mint manager
  const mintManager = await MintManager.fromAccountAddress(
    provider.connection,
    mintManagerId
  );
  expect(mintManager.mint.toString()).toBe(mintKeypair.publicKey.toString());
  expect(mintManager.authority.toString()).toBe(
    provider.wallet.publicKey.toString()
  );
  expect(mintManager.ruleset.toString()).toBe(
    findRulesetId(RULESET_NAME).toString()
  );
});

test("Delegate", async () => {
  const mintManagerId = findMintManagerId(mintKeypair.publicKey);
  const tx = new Transaction();
  const holderAtaId = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    provider.wallet.publicKey
  );
  const holderAta = await getAccount(provider.connection, holderAtaId);
  expect(holderAta.isFrozen).toBe(true);
  expect(holderAta.mint.toString()).toBe(mintKeypair.publicKey.toString());
  expect(holderAta.amount.toString()).toBe("1");

  tx.add(
    createApproveInstruction(
      {
        mintManager: mintManagerId,
        mint: mintKeypair.publicKey,
        holderTokenAccount: holderAtaId,
        holder: provider.wallet.publicKey,
        delegate: delegate.publicKey,
      },
      { approveIx: { amount: 1 } }
    )
  );
  await executeTransaction(provider.connection, tx, provider.wallet);

  const holderAtaCheck = await getAccount(provider.connection, holderAtaId);
  expect(holderAtaCheck.isFrozen).toBe(true);
  expect(holderAtaCheck.mint.toString()).toBe(mintKeypair.publicKey.toString());
  expect(holderAtaCheck.amount.toString()).toBe("1");
  expect(holderAtaCheck.delegate?.toString()).toBe(
    delegate.publicKey.toString()
  );
  expect(holderAtaCheck.delegatedAmount.toString()).toBe("1");
});

test("Set in use by", async () => {
  const mintManagerId = findMintManagerId(mintKeypair.publicKey);
  const holderAtaId = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    provider.wallet.publicKey
  );

  const tx = new Transaction();
  tx.add(
    createSetInUseByInstruction(
      {
        mintManager: mintManagerId,
        holder: provider.wallet.publicKey,
        holderTokenAccount: holderAtaId,
      },
      {
        setInUseByIx: {
          inUseByAddress: IN_USE_BY_AUTHORITY.publicKey,
        },
      }
    )
  );
  await executeTransaction(provider.connection, tx, provider.wallet);

  // check mint manager
  const mintManager = await MintManager.fromAccountAddress(
    provider.connection,
    mintManagerId
  );
  expect(mintManager.mint.toString()).toBe(mintKeypair.publicKey.toString());
  expect(mintManager.inUseBy?.toString()).toBe(
    IN_USE_BY_AUTHORITY.publicKey.toString()
  );
  expect(mintManager.authority.toString()).toBe(
    provider.wallet.publicKey.toString()
  );
  expect(mintManager.ruleset.toString()).toBe(
    findRulesetId(RULESET_NAME).toString()
  );
});

test("Revoke", async () => {
  const mintManagerId = findMintManagerId(mintKeypair.publicKey);
  const tx = new Transaction();
  const holderAtaId = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    provider.wallet.publicKey
  );
  const holderAta = await getAccount(provider.connection, holderAtaId);
  expect(holderAta.isFrozen).toBe(true);
  expect(holderAta.mint.toString()).toBe(mintKeypair.publicKey.toString());
  expect(holderAta.amount.toString()).toBe("1");
  expect(holderAta.delegate?.toString()).toBe(delegate.publicKey.toString());
  expect(holderAta.delegatedAmount.toString()).toBe("1");
  tx.add(
    createRevokeInstruction({
      mintManager: mintManagerId,
      mint: mintKeypair.publicKey,
      holderTokenAccount: holderAtaId,
      holder: provider.wallet.publicKey,
    })
  );
  await expect(
    executeTransaction(provider.connection, tx, provider.wallet)
  ).rejects.toThrow();
});
