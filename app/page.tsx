"use client";
import { LazorkitProvider, useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

import * as anchor from '@coral-xyz/anchor';

export default function Home() {

  const [balance, setBalance] = useState(0);

  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);

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

  useEffect(() => {
    const getBalance = async () => {
      const balance = await connection.getBalance(new PublicKey(smartWalletPubkey!));
      setBalance(balance);
    }
    getBalance();
  }, [smartWalletPubkey]);

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
    <div>
      <LazorkitProvider
        rpcUrl="https://api.devnet.solana.com"
        ipfsUrl="https://portal.lazor.sh"
        paymasterUrl="https://lazorkit-paymaster.onrender.com"
      >
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1>LazorKit Wallet Demo 1</h1>

          <div>LazorKitProgram ID: {new anchor.web3.PublicKey('3CFG1eVGpUVAxMeuFnNw7CbBA1GQ746eQDdMWPoFTAD8').toString()}</div>
          <div>Paymaster Wallet: {new anchor.web3.PublicKey('hij78MKbJSSs15qvkHWTDCtnmba2c1W4r1V22g5sD8w').toString()}</div>
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
                Balance: {balance / LAMPORTS_PER_SOL}
              </p>
              <p>
                Smart Wallet Address: {smartWalletPubkey?.toString()}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <ul style={{ fontSize: '24px', fontWeight: 'bold' }}>Why LazorKit?</ul>
        <ul>No usernames to remember</ul>
        <ul>No passwords to forget</ul>
        <ul>Nothing to install</ul>
        <ul>Works between devices</ul>
        <ul>Works between websites</ul>
        <ul>Works between apps</ul>
      </div>
    </div>
  );
}
