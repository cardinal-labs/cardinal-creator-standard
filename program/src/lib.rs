pub mod errors;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;

solana_program::declare_id!("creatS3mfzrTGjwuLD1Pa2HXJ1gmq6WXb4ssnwUbJez");

#[program]
pub mod cardinal_creator_standard {
    use super::*;

    // mint_manager
    pub fn init_mint_manager(ctx: Context<InitMintManagerCtx>) -> Result<()> {
        mint_manager::init_mint_manager::handler(ctx)
    }

    pub fn update_mint_manager(
        ctx: Context<UpdateMintManagerCtx>,
        ix: UpdateMintManagerIx,
    ) -> Result<()> {
        mint_manager::update_mint_manager::handler(ctx, ix)
    }

    // standard
    pub fn init_standard(ctx: Context<InitStandardCtx>, ix: InitStandardIx) -> Result<()> {
        standard::init_standard::handler(ctx, ix)
    }

    pub fn update_standard(ctx: Context<UpdateStandardCtx>, ix: UpdateStandardIx) -> Result<()> {
        standard::update_standard::handler(ctx, ix)
    }

    // token
    pub fn init_mint(ctx: Context<InitMintCtx>) -> Result<()> {
        token::init_mint::handler(ctx)
    }

    pub fn init_account(ctx: Context<InitAccountCtx>) -> Result<()> {
        token::init_account::handler(ctx)
    }

    pub fn approve(ctx: Context<ApproveCtx>) -> Result<()> {
        token::approve::handler(ctx)
    }

    pub fn revoke(ctx: Context<RevokeCtx>) -> Result<()> {
        token::revoke::handler(ctx)
    }

    pub fn burn(ctx: Context<BurnCtx>) -> Result<()> {
        token::burn::handler(ctx)
    }

    pub fn close(ctx: Context<CloseCtx>) -> Result<()> {
        token::close::handler(ctx)
    }

    pub fn transfer(ctx: Context<TransferCtx>) -> Result<()> {
        token::transfer::handler(ctx)
    }

    pub fn pre_transfer(ctx: Context<PreTransferCtx>) -> Result<()> {
        token::pre_transfer::handler(ctx)
    }

    pub fn post_transfer(ctx: Context<PostTransferCtx>) -> Result<()> {
        token::post_transfer::handler(ctx)
    }
}
