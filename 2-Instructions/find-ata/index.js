const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getAssociatedTokenAddress , unpackAccount } = require('@solana/spl-token');
const connection = new Connection("https://devnet.helius-rpc.com/?api-key=ab77d0f0-033d-4753-87a3-ffedebec057a");

async function main() {
    const publicKey = new PublicKey("BSaUbbiVm1H91eub6YcUUTxGJXp75Dj5a4o1feThz2ov");
    const balance = await connection.getBalance(publicKey);
    console.log("Balance is :" + balance / LAMPORTS_PER_SOL + " SOL");
}
main();

async function getTokenBalance(publicKey, mintAddress) {
// return users token balance
const ataaddress = await getAssociatedTokenAddress(mintAddress,publicKey);
console.log("Address is :" + ataaddress.toBase58());
const balanceusdc = await connection.getBalance(ataaddress);
console.log("USDC Balance is :" + balanceusdc)

const accountData = await connection.getAccountInfo(ataaddress);
if(accountData === null) {
    console.log("No account data found for the given address.");
    return;
}else{
console.log("Account Data is :" + accountData);
const innerData = unpackAccount(ataaddress, accountData);
console.log("Inner Data is :" + innerData.amount);
}

}

getTokenBalance(new PublicKey("BSaUbbiVm1H91eub6YcUUTxGJXp75Dj5a4o1feThz2ov"), new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"));
