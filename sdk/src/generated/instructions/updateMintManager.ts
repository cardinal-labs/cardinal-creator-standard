/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";
import {
  UpdateMintManagerIx,
  updateMintManagerIxBeet,
} from "../types/UpdateMintManagerIx";

/**
 * @category Instructions
 * @category UpdateMintManager
 * @category generated
 */
export type UpdateMintManagerInstructionArgs = {
  ix: UpdateMintManagerIx;
};
/**
 * @category Instructions
 * @category UpdateMintManager
 * @category generated
 */
export const updateMintManagerStruct = new beet.BeetArgsStruct<
  UpdateMintManagerInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["instructionDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["ix", updateMintManagerIxBeet],
  ],
  "UpdateMintManagerInstructionArgs"
);
/**
 * Accounts required by the _updateMintManager_ instruction
 *
 * @property [] mintManager
 * @property [] standard
 * @property [**signer**] authority
 * @category Instructions
 * @category UpdateMintManager
 * @category generated
 */
export type UpdateMintManagerInstructionAccounts = {
  mintManager: web3.PublicKey;
  standard: web3.PublicKey;
  authority: web3.PublicKey;
  systemProgram?: web3.PublicKey;
};

export const updateMintManagerInstructionDiscriminator = [
  70, 171, 8, 198, 47, 206, 211, 164,
];

/**
 * Creates a _UpdateMintManager_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category UpdateMintManager
 * @category generated
 */
export function createUpdateMintManagerInstruction(
  accounts: UpdateMintManagerInstructionAccounts,
  args: UpdateMintManagerInstructionArgs,
  programId = new web3.PublicKey("creatS3mfzrTGjwuLD1Pa2HXJ1gmq6WXb4ssnwUbJez")
) {
  const [data] = updateMintManagerStruct.serialize({
    instructionDiscriminator: updateMintManagerInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.mintManager,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.standard,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
