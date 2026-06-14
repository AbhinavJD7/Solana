use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::entrypoint::{entrypoint,ProgramResult};
use solana_program::pubkey::Pubkey;
use solana_program::account_info::{AccountInfo, next_account_info};


entrypoint!(process_instrcution);
#[derive(BorshDeserialize,BorshSerialize)]
struct Counter{
    count:u32
}
#[derive(BorshDeserialize,BorshSerialize)]

enum InstructionData{
    Increase,
    Decrease, 
}
 
pub fn process_instrcution(
    _pubkey: &Pubkey, //Public key of where this program is deployed
    accounts: &[AccountInfo], //Array of all the accounts you are going from read or write to in this txn (here counter account)
    instruction_data: &[u8] // Acutal this the user wants to do (here increase or decrease the counter)
)->ProgramResult{

    let mut iter = accounts.iter();
    let counter_account = next_account_info(&mut iter)?;

    //check if the counter account has signer the txn
     if !counter_account.is_signer {
        return Err(solana_program::program_error::ProgramError::MissingRequiredSignature) ;
     }

    //read the data inside the counter account, deserialize it to a struct
    let mut counter = Counter::try_from_slice(&counter_account.data.borrow())?; //borrow is used because here it is Rc<RefCell>>
    let instruction_data = InstructionData::try_from_slice(instruction_data)?;

    //increase the value / decrease the value based on whatever the user wants to do
    match instruction_data{
        InstructionData::Increase => {counter.count = counter.count + 1;},
        InstructionData::Decrease => {counter.count = counter.count - 1;}
    }
     
     //write the change back to the blockchain
    counter.serialize(&mut *counter_account.data.borrow_mut())?; //what does this * mean?

     Ok(())
}

// We can't run this directly it is a library , not a binary