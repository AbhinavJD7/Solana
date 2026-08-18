How to think about your code:
When you want to add a new feature (like a deposit function), you follow these 3 steps:

1: State (#[account]): Does this new feature need to store new data on the blockchain? If yes, create a new struct or update an existing one (like VaultState).

2: Context (#[derive(Accounts)]): What accounts are needed to perform a deposit? You will need the user's wallet, the vault state, the actual vault account, and the system program. You write a new struct like pub struct Deposit<'info> { ... } and define the access control (who pays, who is mutable, PDA seeds, etc.) using #[account(...)] macros.

3: Logic (#[program]): Write the actual Rust code inside a new function in the pub mod anchor_vault { ... } block. This function will take your Context from Step 2 as an argument (ctx: Context<Deposit>). Here is where you write the math, call the token program, or update the VaultState data.