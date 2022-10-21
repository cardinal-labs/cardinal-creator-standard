use anchor_lang::prelude::*;
use solana_program::pubkey::Pubkey;

pub const CREATION_LAMPORTS: u64 = 5_000_000;

pub const MINT_MANAGER_SEED: &str = "mint-manager";
pub const MINT_MANAGER_SIZE: usize = 8 + std::mem::size_of::<MintManager>() + 8;

#[account]
pub struct MintManager {
    pub bump: u8,
    pub version: u8,
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub ruleset: Pubkey,
}

pub const RULESET_SEED: &str = "ruleset";
pub const RULESET_SIZE: usize = 8 + 1 + 1 + 1 + 24 + (32 * 10) + (32 * 10);

#[account]
pub struct Ruleset {
    pub bump: u8,
    pub version: u8,
    pub authority: Pubkey,
    pub collector: Pubkey,
    pub check_seller_fee_basis_points: bool,
    pub name: String,
    pub disallowed_addresses: Vec<Pubkey>,
    pub allowed_programs: Vec<Pubkey>,
}
