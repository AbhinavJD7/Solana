const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const fs = require("fs");

console.log("🚀 Starting script...");

try { 
  //deployed program ID
  const PROGRAM_ID = new PublicKey("Fi5fhVtuDLpLy9BHBZAaiMNtDFt8eTpNjW67yyreNr8Z");

  console.log("✓ PublicKey created");

  //local validator
  const connection = new Connection("https://api.devnet.solana.com")
  
  console.log("✓ Connection created");

  // Load your keypair
  const keypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf-8")))
  );

  console.log("✓ Client setup complete");
  console.log("Program ID:", PROGRAM_ID.toBase58());
  console.log("Payer:", keypair.publicKey.toBase58());
}catch(error){
    console.log("Something went wrong: ", error);
}