use solana_program::program::invoke_signed;
//Below is the best format for imports
use solana_program::system_instruction::create_account;
use solana_program::{entrypoint, entrypoint::{ProgramResult}};
use solana_program::pubkey::Pubkey;
use solana_program::account_info::{AccountInfo, next_account_info};

entrypoint!{process_instruction}

pub fn process_instruction(
    progam_id:&Pubkey,
    accounts:&[AccountInfo],
    _instruction_data:&[u8]
) -> ProgramResult {

    let iter = &mut accounts.iter();
    let payer_account = next_account_info(iter)?;
    let _pda_account = next_account_info(iter)?;
    let payer_pubkey = payer_account.key;
    let _system_program = next_account_info(iter)?;

    let (pda , bump) = Pubkey::find_program_address(
        &[b"client1" , payer_pubkey.as_ref()],
        &progam_id
    );

    //doing cpi to the system program 
    let ix = create_account(
        &payer_account.key, //from pubkey
        &pda,               //to pubkey
        1000_000_000,       //lamporrts
        4,                  //space
        &progam_id,         //owner
    );

    let signer_seeds = &[b"client1" , payer_pubkey.as_ref(),&[bump]];

    invoke_signed(&ix, accounts, &[signer_seeds])?;
     Ok(())
}
