import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SolanaStake from './SolanaStake';
import reportWebVitals from './reportWebVitals';

const {REACT_APP_NETWORK , REACT_APP_VOTE_ADDRESS, REACT_APP_VALIDATOR_NAME} =  process.env;
const network = REACT_APP_NETWORK || ''
const voteAddress = REACT_APP_VOTE_ADDRESS || '';
const validatorName = REACT_APP_VALIDATOR_NAME || '';

ReactDOM.render(
  <React.StrictMode>
    <SolanaStake network={network} voteAddress={voteAddress} validatorName={validatorName} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
