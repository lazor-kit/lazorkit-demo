"use client";
import { LazorkitProvider, useWallet } from "@lazorkit/wallet";
import * as anchor from '@coral-xyz/anchor';

export default function Home() {

  const {
    smartWalletPubkey,
    isConnected,
    isConnecting,
    isSigning,
    error,
    connect,
    disconnect,
    signTransaction,
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleSign = async () => {
    if (!smartWalletPubkey) return;

    // Create a memo instruction
    const instruction = new anchor.web3.TransactionInstruction({
      keys: [],
      programId: new anchor.web3.PublicKey('Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'),
      data: Buffer.from('Hello from LazorKit! 🚀', 'utf-8'),
    });

    try {
      const signature = await signTransaction(instruction);
      console.log('Transaction signature:', signature);
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <LazorkitProvider
        rpcUrl="https://api.devnet.solana.com"
        ipfsUrl="https://portal.lazor.sh"
        paymasterUrl="https://lazorkit-paymaster.onrender.com"
      >
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2>LazorKit Wallet Demo</h2>

          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p>
                Wallet: {smartWalletPubkey?.toString()}
              </p>
              <button
                onClick={handleSign}
                disabled={isSigning}
              >
                {isSigning ? 'Signing...' : 'Sign Message'}
              </button>
              <button
                onClick={() => disconnect()}
                style={{ backgroundColor: '#ff6b6b' }}
              >
                Disconnect
              </button>
            </div>
          )}

          {error && (
            <p style={{ color: 'red' }}>
              Error: {error.message}
            </p>
          )}
        </div>
      </LazorkitProvider>
    </div>
  );
}
