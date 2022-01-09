import React from 'react';
import './App.css';
import Wallet from './lib/solana/SolanaConnect';

interface walletProps {
  network: string;
  voteAddress: string;
  validatorName: string;
}


function SolanaStake(props: walletProps) {
  return (
    <div className='App'>
      <Wallet network={props?.network || ''} voteAddress={props?.voteAddress || ''} validatorName={props?.validatorName || ''}/>
    </div>
  );
}

export default SolanaStake;
