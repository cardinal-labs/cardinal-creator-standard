/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { InitStandardIx, initStandardIxBeet } from '../types/InitStandardIx'

/**
 * @category Instructions
 * @category InitStandard
 * @category generated
 */
export type InitStandardInstructionArgs = {
  ix: InitStandardIx
}
/**
 * @category Instructions
 * @category InitStandard
 * @category generated
 */
export const initStandardStruct = new beet.FixableBeetArgsStruct<
  InitStandardInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['ix', initStandardIxBeet],
  ],
  'InitStandardInstructionArgs'
)
/**
 * Accounts required by the _initStandard_ instruction
 *
 * @property [_writable_] standard
 * @property [**signer**] authority
 * @property [_writable_, **signer**] payer
 * @category Instructions
 * @category InitStandard
 * @category generated
 */
export type InitStandardInstructionAccounts = {
  standard: web3.PublicKey
  authority: web3.PublicKey
  payer: web3.PublicKey
  systemProgram?: web3.PublicKey
}

export const initStandardInstructionDiscriminator = [
  85, 84, 110, 234, 166, 27, 75, 173,
]

/**
 * Creates a _InitStandard_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitStandard
 * @category generated
 */
export function createInitStandardInstruction(
  accounts: InitStandardInstructionAccounts,
  args: InitStandardInstructionArgs,
  programId = new web3.PublicKey('creatS3mfzrTGjwuLD1Pa2HXJ1gmq6WXb4ssnwUbJez')
) {
  const [data] = initStandardStruct.serialize({
    instructionDiscriminator: initStandardInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.standard,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}