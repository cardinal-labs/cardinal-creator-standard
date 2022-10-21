use crate::errors::ErrorCode;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateRulesetIx {
    pub check_seller_fee_basis_points: bool,
    pub disallowed_addresses: Vec<Pubkey>,
    pub allowed_programs: Vec<Pubkey>,
}

#[derive(Accounts)]
#[instruction(ix: UpdateRulesetIx)]
pub struct UpdateRulesetCtx<'info> {
    #[account(mut)]
    ruleset: Account<'info, Ruleset>,
    #[account(constraint = authority.key() == ruleset.authority @ ErrorCode::InvalidAuthority)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<UpdateRulesetCtx>, ix: UpdateRulesetIx) -> Result<()> {
    let ruleset = &mut ctx.accounts.ruleset;
    ruleset.check_seller_fee_basis_points = ix.check_seller_fee_basis_points;
    ruleset.allowed_programs = ix.allowed_programs;
    ruleset.disallowed_addresses = ix.disallowed_addresses;
    Ok(())
}
