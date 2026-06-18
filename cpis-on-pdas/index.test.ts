 import { LiteSVM } from "litesvm";
import { PublicKey, Keypair, TransactionInstruction, Transaction, SystemProgram } from "@solana/web3.js";

let liveSvm: LiteSVM;
let pda: PublicKey;
let bump: number;
let programId: PublicKey;
let payer: Keypair;

// initialise a new litesvm
liveSvm = new LiteSVM();
// deploy our program on it
programId = PublicKey.unique(); // 11111111111111111111111111111111
payer = Keypair.generate();

// NOTE: Ensure this path correctly points to your compiled .so file
// If you compile with standard tools it might be "./pda_contract/target/deploy/pda_contract.so"
liveSvm.addProgramFromFile(programId, "pda_contract/target/deploy/pda_contract.so");

// airdrop some sol to the payer
liveSvm.airdrop(payer.publicKey, BigInt(10000000000));
// find the pda locally(js file)
[pda, bump] = PublicKey.findProgramAddressSync([Buffer.from("client1"), payer.publicKey.toBuffer()], programId);

// construct the transaction
let ix = new TransactionInstruction({
    keys: [
        {
            pubkey: payer.publicKey,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: pda,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        }
    ],
    programId,
    data: Buffer.from("")
});

// create a new transaction
const tx = new Transaction().add(ix);
tx.feePayer = payer.publicKey;
tx.recentBlockhash = liveSvm.latestBlockhash();
tx.sign(payer);

let res = liveSvm.sendTransaction(tx);
console.log(res.toString())

const balance = liveSvm.getBalance(pda);
console.log(balance)

// expect(Number(balance)).toBeGreaterThan(0);
if (Number(balance) != 1000000000) {
    console.log("failed")
} else {
    console.log("passed");
}
