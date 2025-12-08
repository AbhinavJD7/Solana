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
