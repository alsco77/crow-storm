import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Utils } from './utils';
import { FirebaseService } from './firebase.service';
import { CommunicateService } from './communicate.service';
import { EthAccount } from '../classes/eth-account';
import { Coin } from '../classes/coin';
import { TransactionReceipt } from '../classes/transaction-receipt';
import { Web3LoadingStatus } from '../classes/web3-loading-status.enum';

const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
declare var web3;

// tslint:disable-next-line
const CrowdsaleAbi = [{ "constant": true, "inputs": [], "name": "rate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cap", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "weiRaised", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "capReached", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "wallet", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_beneficiary", "type": "address" }], "name": "buyTokens", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "token", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_beneficiary", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "claimTokens", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "inputs": [{ "name": "_rate", "type": "uint256" }, { "name": "_cap", "type": "uint256" }, { "name": "_token", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "purchaser", "type": "address" }, { "indexed": true, "name": "beneficiary", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "TokenPurchase", "type": "event" }]

export class TxInfo {

  status: TxStatus;
  nonce: string;

  constructor(status: TxStatus, nonce: string) {
    this.status = status;
    this.nonce = nonce;
  }
}

export enum TxStatus {
  hash = 'hash',
  receipt = 'receipt',
  confirmed = 'confirmed',
  error = 'error'
}

@Injectable()
export class Web3Service implements OnDestroy {

  public web3js: any;

  public isMetaMask: boolean;
  public isRopsten: boolean;

  public accountInterval: any;

  public crowCoin: Coin = {
    contractAddress: '0xd87469ec5737d8dde6d07001dfb6f2178fcd734b',
    id: 'crowCoin',
    name: 'Crow Coin',
    ratio: 8000,
    saleContractAddress: '0xf7e7d4cd6359a7825987d4d3d4d8126f7f3583b0',
    symbol: 'CROW'
  };

  public web3Status = new BehaviorSubject<Web3LoadingStatus>(null);
  public web3Status$ = this.web3Status.asObservable();

  public account = new BehaviorSubject<string>(null);
  public account$ = this.account.asObservable();

  public txStatus = new BehaviorSubject<TxInfo>(null);
  public txStatus$ = this.txStatus.asObservable();


  constructor(private utils: Utils, private firebase: FirebaseService, private comService: CommunicateService) {
    if (typeof web3 !== 'undefined') {
      this.web3js = new Web3(web3.currentProvider);
      this.isMetaMask = true;
      console.log('Web3Service: IsMetaMask');
      try {
        this.web3js.eth.net.getId().then((id: number) => {
          console.log('Web3Service: Network retrieved: ID= ' + id);
          switch (id) {
            case 3:
              this.isRopsten = true;
              console.log('Web3Service: Is Ropsten');
              this.web3js.currentProvider.enable().then((accs: string[]) => {
                console.log('Web3Service: Got accounts: ' + JSON.stringify(accs));
                if (accs[0]) {
                  this.account.next(accs[0]);
                  this.web3Status.next(Web3LoadingStatus.complete);
                } else {
                  this.account.next(accs[0]);
                  this.web3Status.next(Web3LoadingStatus.noAccountsAvailable);
                }
                this.accountInterval = setInterval(() => {
                  this.checkAccountMetaMask();
                }, 500);
              });
              return;
            default:
              // this.isRopsten = false;
              this.isRopsten = true;
              console.log('Web3Service: Is Not Ropsten');
              this.web3Status.next(Web3LoadingStatus.wrongNetwork);
              return;
          }
        });
      } catch (e) {
        this.web3Status.next(Web3LoadingStatus.error);
      }
    } else {
      // this.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));
      this.web3Status.next(Web3LoadingStatus.noMetaMask);
    }
  }

  ngOnDestroy() {
    clearInterval(this.accountInterval);
  }

  checkAccountMetaMask() {
    this.web3js.eth.getAccounts().then((accs: string[]) => {
      console.log('Web3Service: loadedaccounts: ' + JSON.stringify(accs));
      if (accs[0] !== this.account.value) {
        console.log('Web3Service: new account found: ' + JSON.stringify(accs[0]));
        if (accs[0] !== undefined) {
          if (this.web3Status.value !== Web3LoadingStatus.complete) {
            this.web3Status.next(Web3LoadingStatus.complete);
          }
        } else {
          this.web3Status.next(Web3LoadingStatus.noAccountsAvailable);
        }
        this.account.next(accs[0]);
      }
    });
  }

  // setProvider(provider: any) {
  //   this.web3 = new Web3(provider);
  //   // this.currentProvider.next(provider.host);
  //   console.log(JSON.stringify(this.web3js.eth.accounts));
  // }

  // async getAccountFromPKeyAsync(pkey: string): Promise<EthAccount> {
  //   const acc = await this.web3js.eth.accounts.privateKeyToAccount(pkey);
  //   if (acc != null) {
  //     // this.authenticatedAccount.next(acc);
  //     this.firebase.logAccountRetrieval(acc.address);
  //   }
  //   return Promise.resolve(acc);
  // }

  async getTokenBalanceAsync(tokenAddr: string = this.crowCoin.contractAddress, userAddress: string = this.account.value): Promise<string> {
    const parsedUserAddress = this.utils.getNakedAddress(userAddress);
    const functionHash = this.utils.getFunctionSignature('balanceOf(address)');
    // TODO - functionHash should be parsed to certain length
    const contractData = functionHash + '000000000000000000000000' + parsedUserAddress;
    const balanceHex = await this.web3js.eth.call({
      to: tokenAddr,
      data: contractData
    });
    if (balanceHex) {
      return Promise.resolve(this.web3js.utils.toBN(balanceHex).toString());
    }
    return Promise.reject(null);
  }

  async getEthBalanceAsync(userAddress: string = this.account.value): Promise<string> {
    // TODO  - confirm useraddress has 0x
    const balance = await this.web3js.eth.getBalance(userAddress);
    if (balance) {
      console.log(balance);
      const tokens = this.web3js.utils.toBN(balance).toString();
      console.log('Eth Owned: ' + this.web3js.utils.fromWei(tokens, 'ether'));
      return Promise.resolve(tokens);
    }
    return Promise.reject(null);
  }

  async estimateGasAsync(rawTransaction: any) {
    const gasCost = await this.web3js.eth.estimateGas(rawTransaction);
    console.log('Gascost: ' + gasCost);
    return Promise.resolve(gasCost);
  }

  async getPurchaseTokensTransaction(userAddress: string, saleContractAddress: string, weiAmountHex: string,
    gasPriceGwei: number, gasLimit: number): Promise<any> {
    userAddress = this.utils.prefixHex(userAddress);
    saleContractAddress = this.utils.prefixHex(saleContractAddress);

    const contract = new this.web3js.eth.Contract(CrowdsaleAbi, saleContractAddress, {
      from: userAddress
    });

    const count = await this.web3js.eth.getTransactionCount(userAddress);
    const chainId = await this.web3js.eth.net.getId();

    const rawTransaction = {
      'from': userAddress,
      'nonce': '0x' + count.toString(16),
      'gasPrice': this.web3js.utils.toHex(gasPriceGwei * 1e9),
      'gasLimit': this.web3js.utils.toHex(gasLimit),
      'to': saleContractAddress,
      'value': weiAmountHex,
      'data': contract.methods.buyTokens(userAddress).encodeABI(),
      'chainId': chainId
    };

    return Promise.resolve(rawTransaction);
  }

  async convertWeiToEth(wei: string) {
    return Promise.resolve(this.web3js.utils.fromWei(wei, 'ether'));
  }

  async getNonce() {
    const count = await this.web3js.eth.getTransactionCount(this.account.value);
    return count;
  }

  async purchaseTokensAsync(userAddress: string, amount: string, successCallback: Function): Promise<TransactionReceipt> {
    try {
      userAddress = this.account.value;
      const count = await this.web3js.eth.getTransactionCount(userAddress);
      const ethAmount = (parseInt(amount) / this.crowCoin.ratio).toString();
      const weiAmountHex = this.web3js.utils.toHex(this.web3js.utils.toWei(ethAmount));
      let rawTransaction = await this.getPurchaseTokensTransaction(userAddress, this.crowCoin.saleContractAddress, weiAmountHex,
        121, 250000);
      console.log('evaluating cost of tx:' + JSON.stringify(rawTransaction));
      const gasLimit = await this.estimateGasAsync(rawTransaction);
      rawTransaction = await this.getPurchaseTokensTransaction(userAddress, this.crowCoin.saleContractAddress, weiAmountHex,
        121, gasLimit);

      console.log(`Raw tx: \n${JSON.stringify(rawTransaction, null, '\t')}`);
      this.firebase.logTokenPurchaseTxCreated(userAddress, rawTransaction);

      this.txStatus.next(null);
      const receipt = await this.web3js.eth.sendTransaction(rawTransaction)
        .on('transactionHash', (hash) => {
          this.txStatus.next(new TxInfo(TxStatus.hash, count));
        })
        .on('receipt', (receipt) => {
          this.txStatus.next(new TxInfo(TxStatus.receipt, count));
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          if (confirmationNumber === 0) {
            this.txStatus.next(new TxInfo(TxStatus.confirmed, count));
            this.comService.addCoins(parseInt(amount));
          }
        })
        .on('error', () => {
          this.txStatus.next(new TxInfo(TxStatus.error, count));
        });
      console.log('sending transaction receipt: ' + JSON.stringify(receipt));
      return Promise.resolve(receipt);
    } catch (e) {
      this.firebase.logTokenPurchaseError(userAddress, JSON.stringify(e));
      return Promise.reject(null);
    }
  }
  async claimTokensAsync(amount: string): Promise<TransactionReceipt> {
    try {
      const userAddress = this.utils.prefixHex(this.account.value);
      const wei0hex = '0x0';
      const weiAmountHex = this.web3js.utils.toHex(this.web3js.utils.toWei(amount));
      const saleContractAddress = this.utils.prefixHex(this.crowCoin.saleContractAddress);

      const contract = new this.web3js.eth.Contract(CrowdsaleAbi, saleContractAddress, {
        from: userAddress
      });

      const count = await this.web3js.eth.getTransactionCount(userAddress);
      const chainId = await this.web3js.eth.net.getId();


      const rawTransaction = {
        'from': userAddress,
        'nonce': '0x' + count.toString(16),
        'gasPrice': this.web3js.utils.toHex(131 * 1e9),
        'gasLimit': this.web3js.utils.toHex(100000),
        'to': saleContractAddress,
        'value': wei0hex,
        'data': contract.methods.claimTokens(userAddress, weiAmountHex).encodeABI(),
        'chainId': chainId
      };

      console.log(`Raw tx: \n${JSON.stringify(rawTransaction, null, '\t')}`);

      this.txStatus.next(null);
      const receipt = await this.web3js.eth.sendTransaction(rawTransaction)
        .on('transactionHash', (hash) => {
          this.txStatus.next(new TxInfo(TxStatus.hash, count));
        })
        .on('receipt', (receipt) => {
          this.txStatus.next(new TxInfo(TxStatus.receipt, count));
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          if (confirmationNumber === 0) {
            this.txStatus.next(new TxInfo(TxStatus.confirmed, count));
            this.comService.addCoins(parseInt(amount));
          }
        })
        .on('error', () => {
          this.txStatus.next(new TxInfo(TxStatus.error, count));
        });
      console.log('sending transaction receipt: ' + JSON.stringify(receipt));
      return Promise.resolve(receipt);
    } catch (e) {
      this.firebase.logTokenPurchaseError(this.account.value, JSON.stringify(e));
      return Promise.reject(null);
    }
  }
}
