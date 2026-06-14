//This code generates a brand new Solana wallet (Keypair) and displays its credentials.
use solana_sdk::signature::{Keypair, Signer};
// for PDA
use solana_sdk::pubkey; // macro
use solana_sdk::pubkey::Pubkey;

fn main() {

    // Public/Private Key Address
    let keypair = Keypair::new();
    println!("New Keypair: {:?}", keypair);
    println!("Public Key: {}", keypair.pubkey());
    println!("Secret Key: {}", keypair.to_base58_string());

    //PDA : Program Derived Addresss

    let program_address = pubkey!("11111111111111111111111111111111");  // this pubkey is a macro which check that the string entered is a valid Solana Address or not at compile time
                                            // "11111....111" this is System Program ID in here it is acting as a owner of the PDA.
    let seeds = [b"helloWorld".as_ref()];  // b tell Rust to treat "helloWorld" as bytes not UTF-8 string
    let (pda, bump) = Pubkey::find_program_address(&seeds, &program_address); // find_program_address takes your seeds and the program_address and mathematically combines them to find a valid PDA.
    println!("PDA: {}", pda);
    println!("Bump: {}", bump); // The "magic number" (0-255) that was required to push the address off the curve to make it a valid PDA. You need to save this bump if you want to verify this address later efficiently.
}



//Solana does read in parallel processing and write in sequential processing. 
//So, if you have 100 transactions that all read from the same account, they can be processed in parallel. 
//But if they all try to write to the same account, they will be processed one after the other to avoid conflicts.

//Solana Struct looks something like this

//pda account do not have private key, so they cannot sign transactions, but they can be used to store data and be owned by a program.
//{
    //key:number,
    //lamports:number,
    //data:Uint8Array,
    //owner:PublicKey,
    //is_executable:boolean
//}

//Programs

//if is_executable is true, then the account is a program account, 
// which means it contains executable code and can be invoked by other programs.
//Program are stateless, only hold complied code, they do not hold any data.
// All program accounts are owned by loaders

//Transactions 

//It includes all accounts that transaction will reference
//It is atomic, if one instruction fails to execute the transaction fails
//Transaction Struct below it has 2 things message and signers  
//{
//  message:{
//              instructions: Array<Instructions>,
//              recent_blockhash: number,
//              fee_payer: PublicKey,
//            }
//  signers:Array<Uint8Array>
//}

//Compute
//All on chain actions require compute units
//Solana has a max no of compute units per block (60 million etc)
//Add extra compute units (not recommened)

//PDA
//

