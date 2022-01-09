
import { WalletError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    Authorized, Keypair,
    Lockup, PublicKey,
    LAMPORTS_PER_SOL,
    sendAndConfirmRawTransaction, sendAndConfirmTransaction,
    StakeProgram, SystemProgram, Transaction,
    TransactionInstruction, AccountBalancePair, DelegateStakeParams, CreateStakeAccountParams
} from '@solana/web3.js';

import React, { FC, useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Notification } from './Notification';
import './StakeSol.css'
interface walletProps {
    closeConnection?: boolean;
}
export const StakeSol = (props?: walletProps) => {
    const { connection } = useConnection();

    const { publicKey, connected, disconnecting, signTransaction, wallets } = useWallet();
    const [balance, setbalance]: any = useState(0)
    const voteAccountPK: string | any = process.env.REACT_APP_VOTE_ADDRESS;
    useEffect(() => {

        if (connected) {
            onMsg('wallet connected', 'success')
            connection.getBalance(publicKey).then(r => {
                const balance = r / 1000000000;
                setbalance(balance)
            }
            );
        }if(disconnecting){
            onMsg('wallet disconnected', 'error')
        }
    }, [connected])

    const verifyBalance = async (amountToSend: number, walletPubkey: PublicKey) => {
        const balance = await connection.getBalance(walletPubkey);
        const { blockhash } = await connection.getRecentBlockhash('max');
        const currentTxFee = await (await connection.getFeeCalculatorForBlockhash(blockhash, 'recent')).value?.lamportsPerSignature || 0
        const balanceCheck = amountToSend < balance + currentTxFee ? true : false;
        if (!balanceCheck) {
            onMsg('not enogh balance', 'error')
            // throw new Error('not enogh balance')
            return false;
        }
        return true
    }

    const createStakeAccount = async (sol: number) => {

        const solToLamport = sol * 1000000000;
        const isValid = await verifyBalance(solToLamport, publicKey);
        if (isValid) {
            const minimumAmount = await connection.getMinimumBalanceForRentExemption(
                StakeProgram.space,
            );
            const fromPubkey = publicKey;
            const newStakeAccount = new Keypair();
            const authorizedPubkey = publicKey;
            const authorized = new Authorized(authorizedPubkey, authorizedPubkey);
            const lockup = new Lockup(0, 0, fromPubkey);
            const lamports = minimumAmount + solToLamport;
            const stakeAccountIns: CreateStakeAccountParams = {
                fromPubkey,
                stakePubkey: newStakeAccount.publicKey,
                authorized,
                lockup,
                lamports
            }
            const newStakeAccountIns = StakeProgram.createAccount(stakeAccountIns)
            return { newStakeAccountIns, newStakeAccount }

        }
    }
    const delegate = async () => {
        try {

            await createStakeAccount(amount).then(r => {

                const stakeAcc: any = r?.newStakeAccount;
                const instruction: DelegateStakeParams = {
                    stakePubkey: stakeAcc.publicKey,
                    authorizedPubkey: new PublicKey(publicKey),
                    votePubkey: new PublicKey(voteAccountPK)
                }
                const stakeAccIns: any = r?.newStakeAccountIns;
                const stake: Transaction[] = [stakeAccIns, StakeProgram.delegate(instruction)]
                sendTx(stake, [stakeAcc])

            })
        } catch (error) {
            console.log(error)
        }

    }
    const sendTx = async (txParam: TransactionInstruction[] | Transaction[], extraSigners?: Keypair[]) => {
        setisLoading(true)
        try {
            const { blockhash } = await connection.getRecentBlockhash('recent');
            let transaction: Transaction = new Transaction({ feePayer: publicKey, recentBlockhash: blockhash }).add(...txParam);
            transaction = await signTransaction(transaction);
            //LMT: add extra signers (fix create-token-account problem)
            if (extraSigners) transaction.partialSign(...extraSigners);
            //LMT: check null signatures
            for (let i = 0; i < transaction.signatures.length; i++) {
                if (!transaction.signatures[i].signature) {
                    throw Error(`missing signature for ${transaction.signatures[i].publicKey.toString()}. Check .isSigner=true in tx accounts`)
                }
            }

            const rawTransaction = transaction.serialize({ requireAllSignatures: false });
            const txid = await connection.sendRawTransaction(rawTransaction);
            onMsg(`transaction: ${txid}`, 'info', () => { window.open(`https://explorer.solana.com/tx/${txid}?cluster=${process.env.REACT_APP_NETWORK}`) })
            await connection.confirmTransaction(txid, 'confirmed');
            onMsg('transaction finish', 'success')

        } catch (error) {
            onMsg('transaction failed', 'error')
        }
        setisLoading(false)
    }

    const [amount, setamount] = useState(0);
    const [isLoading, setisLoading] = useState(false)
    const onMsg = (msg: any, type: any, fn?: any) => {
        toast.custom(
            <Notification
                message={msg}
                variant={type}
                fn={fn}
            />,
            { duration: 3000 }
        )
    }



    return (<span id='delegate-form'>
        {connected && <form>
            <div id='input-group'>
                <input type='number' placeholder='amount of sol' onChange={(e) => { setamount(Number(e.target.value)) }} />
                <button type='button' onClick={delegate} disabled={!publicKey || amount == 0 || isLoading}>
                    Stake
                </button>
            </div>
            <div id='wallet-balance'>balance: {balance.toFixed(3)} SOL</div>
            <p>
            Click on the Stake button will generate a new stake account with the submitted allocated SOLs & delegate those SOLs to {process.env.REACT_APP_VALIDATOR_NAME} secured node            </p>
        </form>}
    </span>
    );
};
