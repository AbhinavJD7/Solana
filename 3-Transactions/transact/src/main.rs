use anyhow::Result;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    native_token::LAMPORTS_PER_SOL, 
    signature::Signer, 
    signer::keypair::Keypair,
    transaction::Transaction,
    system_instruction,
};


#[tokio::main]
async fn main() -> Result<()> {
    let connection = RpcClient::new_with_commitment(
        "http://localhost:8899".to_string(),
        CommitmentConfig::confirmed(),
    );

    // Fetch the latest blockhash and last valid block height
    let blockhash = connection.get_latest_blockhash().await?;

    // Generate sender and recipient keypairs
    let sender = Keypair::new();
    let recipient = Keypair::new();


    // Define the amount to transfer (0.01 SOL)
    let transfer_amount = LAMPORTS_PER_SOL / 100;

    // Create a transfer instruction for transferring SOL from sender to recipient

    let transfer_instruction = system_instruction::transfer(
        &sender.pubkey(), 
        &recipient.pubkey(), 
        transfer_amount
    );

    let mut transaction =
        Transaction::new_with_payer(&[transfer_instruction], Some(&sender.pubkey()));
    transaction.sign(&[&sender], blockhash);

    println!("{:#?}", transaction);

    Ok(())
}