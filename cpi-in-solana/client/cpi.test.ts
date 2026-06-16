import { Keypair, PublicKey, SystemInstruction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import {test} from "bun:test"
import { LiteSVM } from "litesvm"

test("CPI works as expected" , async () => {
    let svm = new LiteSVM();

    let doubleContract = PublicKey.unique();
    let cpiContract = PublicKey.unique();
     

    svm.addProgramFromFile(doubleContract,"target/sbpf-solana-solana/release/cpi_in_solana.so");
    svm.addProgramFromFile(cpiContract,"cpi-contract/target/sbpf-solana-solana/release/cpi_contract.so")

    let userAcc = new Keypair();
    let dataAcc = new Keypair();

    svm.airdrop(userAcc.publicKey,BigInt(1000_000_000));

    createDataOnChain(svm,dataAcc,userAcc,doubleContract);

    //sending our custom transaction to solana blockchain
    let ix = new TransactionInstruction({
        keys:[
            {pubkey:dataAcc.publicKey , isSigner:true , isWritable:true},
            {pubkey:doubleContract , isSigner:false , isWritable:false},
        ],
        programId:cpiContract,
        data:Buffer.from(""),
    })
    const blockhash = svm.latestBlockhash();
    let transaction = new Transaction().add(ix);
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userAcc.publicKey;
    transaction.sign(userAcc);
    const dataAccountData = svm.getAccount(dataAcc.publicKey);
    console.log(dataAccountData);
})

function createDataOnChain(svm:LiteSVM,dataAccount:Keypair, payer:Keypair , contractPubkey:PublicKey){
    const blockhash = svm.latestBlockhash();
    const ixs = [
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey :dataAccount.publicKey,
            lamports:Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space:4,
            programId:contractPubkey
        }),
    ];
    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey,
    tx.add(...ixs);
    tx.sign(payer,dataAccount);
    svm.sendTransaction(tx);
}