import * as anchor from "@project-serum/anchor";
import { connectionFor } from "../utils";
import { Keypair, Transaction } from "@solana/web3.js";
import { executeTransaction } from "../utils";
import { createInitRulesetInstruction, Ruleset } from "../sdk/generated";
import { findRulesetId } from "../sdk";

const dotenv = require("dotenv");

dotenv.config();

export type RulesetParams = {
  name: string;
};

const wallet = Keypair.fromSecretKey(
  anchor.utils.bytes.bs58.decode(process.env.RULESET_AUTHORITY || "")
); // your wallet's secret key // your wallet's secret key

const main = async (params: RulesetParams, cluster = "devnet") => {
  const connection = connectionFor(cluster);
  const transaction = new Transaction();

  const rulesetId = findRulesetId(params.name);
  transaction.add(
    createInitRulesetInstruction(
      {
        ruleset: rulesetId,
        authority: wallet.publicKey,
        payer: wallet.publicKey,
      },
      {
        ix: {
          name: params.name,
          collector: wallet.publicKey,
          checkSellerFeeBasisPoints: false,
          disallowedAddresses: [],
          allowedPrograms: [],
        },
      }
    )
  );

  let txid = "";
  try {
    txid = await executeTransaction(
      connection,
      transaction,
      new anchor.Wallet(wallet)
    );
  } catch (e) {
    console.log(`Transactionn failed: ${e}`);
  }

  try {
    await Ruleset.fromAccountAddress(connection, rulesetId);
    console.log(
      `Initialized ruleset successfully https://explorer.solana.com/tx/${txid}?cluster=${cluster}.`
    );
  } catch (e) {
    console.log("Could not initialize ruleset successfully.");
  }
};

const params: RulesetParams = {
  name: "cardinal-no-check-2",
};
main(params).catch((e) => console.log(e));
