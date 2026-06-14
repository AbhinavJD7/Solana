use solana_program::pubkey::Pubkey;

enum ExpressionType{
    Sum,
    Sub,
}

struct AccountInfo{
    pubkey:Pubkey,
    is_signer:bool,
}

 
pub fn process_instrcution(expression_type:ExpressionType, counter_account_pubkey:Pubkey){
    //check if the counter account has signer the txn
    if !counter_account_pubkey.is_signer{
        return;
    }

    //read the data inside the counter account, deserialize it to a struct
    let current_data = blockchain.read(counter_account_pubkey);

    //increase the value / decrease the value based on whatever the user wants to do
    match expression_type{
        ExpressionType::Sub{current_data.counter -= 1 },
         ExpressionType::Sub{current_data.counter += 1}
     }
     
     //write the change back to the blockchain
     blockchain.write(counter_account_pubkey , current_data);
}