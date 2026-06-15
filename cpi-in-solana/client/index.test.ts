import { test, expect } from "bun:test";
import { LiteSVM } from "litesvm"; 
import { 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  LAMPORTS_PER_SOL, 
  TransactionInstruction
} from "@solana/web3.js";
import { pathToFileURL } from "bun";

test("one transfer", () => {
  const svm = new LiteSVM();  
  const contractPubkey = PublicKey.unique();
  //loading our smart contract to the local SVM (solana virtual machine)
  svm.addProgramFromFile(contractPubkey, '../target/deploy/cpi_in_solana.so');
  const payer = new Keypair();
  svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));

  //Now we have to call our double contract with data account

  const dataAccount = new Keypair();
  const blockhash = svm.latestBlockhash();
  const ixs = [
	SystemProgram.createAccount({
		fromPubkey:payer.publicKey,
		newAccountPubkey:dataAccount.publicKey,
		lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))) , //typecast the BigInt response to Number as lamports field expects Number
		space: 4,
		programId: contractPubkey,

	}),
  ]
  const tx = new Transaction();
  tx.recentBlockhash = blockhash;
  tx.feePayer = payer.publicKey;
  tx.add(...ixs);
  tx.sign(payer,dataAccount); //both the new keypair generated has to sign the transaction
  svm.sendTransaction(tx);
  const balanceAfter = svm.getBalance(dataAccount.publicKey);
  expect(balanceAfter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));
  //creating and sending a transaction that tells the Solana network to execute your custom Rust smart contract.

  function Doubleit(){
  const ix2 = new TransactionInstruction({
	keys:[
		{pubkey:dataAccount.publicKey , isSigner:false , isWritable:true}, //which accounts the contract will interact to is stored in keys array
	],
	programId:contractPubkey, //which contract to run
	data:Buffer.from(""),
  })
  const blockhash = svm.latestBlockhash();
  const tx2 = new Transaction();
  tx2.recentBlockhash = blockhash;
  tx2.feePayer = payer.publicKey;
  tx2.add(ix2);
  tx2.sign(payer);
  svm.sendTransaction(tx2);
  svm.expireBlockhash;
}
Doubleit();
Doubleit();
Doubleit();
Doubleit();

  const newDataAcc = svm.getAccount(dataAccount.publicKey);
  console.log(newDataAcc?.data);
  console.log(newDataAcc); 

});
