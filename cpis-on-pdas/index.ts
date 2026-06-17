import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, Connection , SystemProgram , Transaction, PublicKey } from "@solana/web3.js"

const [pda,bump] = PublicKey.findProgramAddressSync([ // Below are ATA derivation seeds
    new PublicKey("CmcT8bch4VwsxHqWEvKGzGtCZdKCeYSZVxhjw5quGjzn").toBuffer(),// wallet address to bytes
    new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").toBuffer(), //token program id to bytes (eg Token22, original spl token program)
    new PublicKey("R9B3oeyDcAdm3uy38hjgZQ7U43F27vyVY3LVyWggUvz").toBuffer()// token mint address to bytes
    ], ASSOCIATED_TOKEN_PROGRAM_ID
);
console.log(pda.toBase58()) //9t8h5jtib2TVwadceSy1b2DH4e98LfKvkDEztWBcte1b