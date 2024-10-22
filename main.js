const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = solanaWeb3;

// Solana mainnet connection
const connection = new Connection("https://api.mainnet-beta.solana.com");

// Your treasury wallet (replace with your wallet address)
const treasuryPublicKey = new PublicKey("C5j2V4duj8H9Tsg3zeTrX9goNLMGex35gqDA5UQ3AVAz");

// CROC token mint address (replace with your token address)
const crocTokenMintAddress = new PublicKey("8UUQwEvwecDeZHWho9ACMifCLsV5G5xy6rg9LvyxAqrn");

// Token distribution rate: 420,690 $CROC for 1 SOL
const crocRate = 420690;

// Minimum and maximum SOL for purchase
const minSol = 0.1;
const maxSol = 100;

let userPublicKey;

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            userPublicKey = response.publicKey.toString();
            document.getElementById('status').innerText = `Wallet Connected: ${userPublicKey}`;
        } catch (err) {
            document.getElementById('status').innerText = 'Error connecting wallet.';
        }
    } else {
        alert('Phantom Wallet not found. Please install it.');
    }
});

document.getElementById('buyCroc').addEventListener('click', async () => {
    const solAmount = parseFloat(document.getElementById('solAmount').value);

    if (!userPublicKey || isNaN(solAmount) || solAmount < minSol || solAmount > maxSol) {
        alert(`Please enter a valid amount between ${minSol} and ${maxSol} SOL.`);
        return;
    }

    try {
        // Send SOL to treasury wallet
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(userPublicKey),
                toPubkey: treasuryPublicKey,
                lamports: solAmount * LAMPORTS_PER_SOL, // Convert SOL to lamports
            })
        );

        const signedTransaction = await window.solana.signAndSendTransaction(transaction);
        await connection.confirmTransaction(signedTransaction);

        // Calculate amount of CROC tokens to distribute
        const crocAmount = solAmount * crocRate;
        await distributeCroc(userPublicKey, crocAmount);

        document.getElementById('status').innerText = `Success! Sent ${crocAmount} CROC tokens.`;
    } catch (error) {
        document.getElementById('status').innerText = `Transaction failed: ${error.message}`;
    }
});

// Function to send CROC tokens after receiving SOL
async function distributeCroc(receiverAddress, crocAmount) {
    const receiverPublicKey = new PublicKey(receiverAddress);

    // Add token transfer logic here using the Solana SPL Token Program
    console.log(`Sending ${crocAmount} CROC to ${receiverAddress}`);
    // You will need to implement the token transfer using Token Program or Anchor.
}
