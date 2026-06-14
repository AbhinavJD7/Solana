console.log("Starting script...");
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, TransactionInstruction  } from "@solana/web3.js";
import * as fs from "fs";

const connection = new Connection("https://api.devnet.solana.com")

//deployed program ID
const PROGRAM_ID = new PublicKey("Fi5fhVtuDLpLy9BHBZAaiMNtDFt8eTpNjW67yyreNr8Z");

// Load your keypair (the one you used to deploy)
const keypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf-8")))
);

try {
    //local validator
    console.log("✓ Client setup complete");
    console.log("Program ID:", PROGRAM_ID.toBase58());
    console.log("Payer:", keypair.publicKey.toBase58());
} catch (error) {
    console.log("Something went wrong: ", error);
}

async function createCounterAccount() {
    try {
        console.log("\nStep 2: Creating Counter Account...");
        // Generate a new keypair for the counter account
        const counterAccount = Keypair.generate();
        console.log("Counter Account:", counterAccount.publicKey.toBase58());

        // Counter struct is 4 bytes (u32)
        const space = 4;

        // Get rent exemption amount
        const rentAmount = await connection.getMinimumBalanceForRentExemption(space);
        console.log("Rent required:", rentAmount, "lamports");

        // Create the account using SystemProgram
        const createAccountIx = SystemProgram.createAccount({
            fromPubkey: keypair.publicKey,
            newAccountPubkey: counterAccount.publicKey,
            lamports: rentAmount,
            space: space,
            programId: PROGRAM_ID,
        });

        // Send transaction
        const { Transaction, sendAndConfirmTransaction } = await import("@solana/web3.js");
        const tx = new Transaction().add(createAccountIx);
        const signature = await sendAndConfirmTransaction(connection, tx, [keypair, counterAccount]);

        console.log("✓ Counter account created!");
        console.log("Transaction signature:", signature);
        console.log("Counter account address:", counterAccount.publicKey.toBase58());

        return counterAccount;

    }
    catch (error) {
        console.log(error);
    }
}

async function initializeCounter(counterAccount: Keypair) {
    try {
        console.log("\nStep 3: Calling Program - Increase Counter...");
        
        // Serialize instruction data using Borsh
        // Enum variant 0 = Increase
        const instructionData = Buffer.from([0]); // Just 1 byte for the enum variant
        
        // Create instruction to call your program
        const instruction = new TransactionInstruction({
            keys: [
                {
                    pubkey: counterAccount.publicKey,
                    isSigner: true,
                    isWritable: true,
                }
            ],
            programId: PROGRAM_ID,
            data: instructionData,
        });

        const tx = new Transaction().add(instruction);
        const signature = await sendAndConfirmTransaction(connection, tx, [keypair, counterAccount]);
        
        console.log("✓ Program executed successfully!");
        console.log("Transaction signature:", signature);

        return signature;
    } catch (error) {
        console.error("Error calling program:", error);
        throw error;
    }
}

// Call the function
(async () => {
    try {
        const counterAccount = await createCounterAccount();
        if (!counterAccount) {
            console.error("Counter account was not created.");
            return;
        }
        console.log("\nAccount created. Save this address for next step:");
        console.log(counterAccount.publicKey.toBase58());
        await initializeCounter(counterAccount);
    } catch (err) {
        console.error("Failed:", err);
    }
})();


