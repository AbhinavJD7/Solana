use anchor_lang::prelude::*;

declare_id!("2bbcrDnftTUekM5s1cYeEg3Fzddj8kEJSnPkv9wRever");

#[program]
pub mod anchor_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)] 
pub struct Initialize <'info> {     // -> DEFINE ACCOUNTS NEEDED FOR THE INSTRUCTION HERE <-
    // You specify who the signer is, what accounts to create, and what accounts to read/write.

    #[account(mut)]
    pub user:Signer<'info>, // this account will sign the transaction to create the vault

    #[account(
        init, //create a new account for vault state
        payer = user,
        seeds = [b"state", user.key().as_ref()], //PDA seeds for uniquness
        bump,
        space = VaultState.INIT_SPACE,
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(
        seeds = [b"state" ,vault_state.key().as_ref()],
        bump,
    )]
    pub vault:SystemAccount<'info>,

    pub system_program:Program<'info,System>
}

// Methods for the Initialize struct.
impl<'info> Initialize<'info> {
    // Sets up the vault state with bump seeds for PDAs.
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()> {

        self.vault_state.set_inner(VaultState {
            vault_bump: bumps.vault,
            vault_state_bump: bumps.vault_state,
            amount: 0,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info>{

    #[account(mut)] //1st account of deposit struct
    pub user:Signer<'info>,

    #[account(
        mut,
        seeds = [b"state",user.key().as_ref()],
        bump = vault_state.vault_state_bump,
    )]
    pub vault_state:Account<'info,VaultState>,

    #[account(
        mut,
        seeds = [b"state",vault_state.key().as_ref()],
        bump = vault_state.vault_bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Deposit<'info> {
    pub fn deposit(&mut self, amount: u64) -> Result<()> {
        // 1. Set up the transfer information
        let cpi_program = self.system_program.to_account_info();
        
        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: self.user.to_account_info(),
            to: self.vault.to_account_info(),
        };

        // 2. Create the Context for the transfer
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // 3. Execute the transfer!
        anchor_lang::system_program::transfer(cpi_ctx, amount)?;

        // 4. Update our VaultState to keep track of total deposits
        self.vault_state.amount += amount;

        Ok(())
    }
}





#[account]
//#[derive(INIT_SPACE)]
pub struct VaultState {
    pub vault_bump:u8, //bump for vault PDA
    pub vault_state_bump:u8, //bump for vault state PDA
    pub amount: u64 //amount to be deposited in the actual vault
}

impl Space for VaultState {
    const INIT_SPACE: usize = 8+1+1+8;
}