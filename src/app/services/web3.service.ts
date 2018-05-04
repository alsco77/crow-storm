import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Utils } from './utils';
import { FirebaseService } from './firebase.service';
import { EthAccount } from '../classes/eth-account';
import { Coin } from '../classes/coin';
import { TransactionReceipt } from '../classes/transaction-receipt';
import { Web3LoadingStatus } from '../classes/web3-loading-status.enum';

const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
declare var web3;

// tslint:disable-next-line
const CrowdsaleAbi = [{ "constant": true, "inputs": [], "name": "rate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "cap", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "weiRaised", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "capReached", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "wallet", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_beneficiary", "type": "address" }], "name": "buyTokens", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "token", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_rate", "type": "uint256" }, { "name": "_cap", "type": "uint256" }, { "name": "_token", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "purchaser", "type": "address" }, { "indexed": true, "name": "beneficiary", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "TokenPurchase", "type": "event" }];

@Injectable()
export class Web3Service implements OnDestroy {

  public web3js: any;

  public isMetaMask: boolean;
  public isRopsten: boolean;

  public accountInterval: any;

  public crowCoin: Coin = {
    contractAddress: "0xcab46d722ab70590d04b55ea27eb344ff806c0eb",
    id: "oasisCredit",
    name: "Oasis Credit",
    ratio: 8000,
    saleContractAddress: "0xd0cd15c52eef857928035e62db3410bbc1aad64b",
    symbol: "OCR"
  }

  public web3Status = new BehaviorSubject<Web3LoadingStatus>(null);
  public web3Status$ = this.web3Status.asObservable();

  public account = new BehaviorSubject<string>(null);
  public account$ = this.account.asObservable();


  constructor(private utils: Utils, private firebase: FirebaseService) {
    if (typeof web3 !== 'undefined') {
      this.web3js = new Web3(web3.currentProvider);
      this.isMetaMask = true;
      console.log("Web3Service: IsMetaMask");

      try {
        this.web3js.eth.net.getId().then((id: number) => {
          console.log("Web3Service: Network retrieved: ID= " + id);
          switch (id) {
            case 3:
              this.isRopsten = true;
              console.log("Web3Service: Is Ropsten");
              this.web3js.eth.getAccounts().then((accs: string[]) => {
                console.log("Web3Service: Got accounts: " + JSON.stringify(accs));
                if (accs[0]) {
                  this.account.next(accs[0]);
                  this.web3Status.next(Web3LoadingStatus.complete);
                } else {
                  this.account.next(accs[0]);
                  this.web3Status.next(Web3LoadingStatus.noAccountsAvailable)
                }
                this.accountInterval = setInterval(() => {
                  this.checkAccountMetaMask();
                }, 500);
              });
              return;
            default:
              // this.isRopsten = false;
              this.isRopsten = true;
              console.log("Web3Service: Is Not Ropsten");
              this.web3Status.next(Web3LoadingStatus.wrongNetwork);
              return;
          }
        })
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
      console.log("Web3Service: loadedaccounts: " + JSON.stringify(accs));
      if (accs[0] !== this.account.value) {
        console.log("Web3Service: new account found: " + JSON.stringify(accs[0]));
        if (this.web3Status.value == Web3LoadingStatus.noAccountsAvailable) {
          this.web3Status.next(Web3LoadingStatus.complete);
        } else if (this.web3Status.value == Web3LoadingStatus.complete) {
          this.web3Status.next(Web3LoadingStatus.noAccountsAvailable);
        }
        this.account.next(accs[0]);
      }
    })
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

  async purchaseTokensAsync(userAddress: string, userPrivKey: string, saleContractAddress: string, weiAmountHex: string,
    gasPriceGwei: number, gasLimit: number, successCallback: Function): Promise<TransactionReceipt> {
    try {
      const rawTransaction = await this.getPurchaseTokensTransaction(userAddress, saleContractAddress, weiAmountHex,
        gasPriceGwei, gasLimit);
      console.log(`Raw tx: \n${JSON.stringify(rawTransaction, null, '\t')}`);
      this.firebase.logTokenPurchaseTxCreated(userAddress, rawTransaction);

      userPrivKey = this.utils.getNakedAddress(userPrivKey);
      const privKey = new Buffer(userPrivKey, 'hex');

      const tx = new Tx(rawTransaction);
      tx.sign(privKey);
      const serializedTxHex = tx.serialize().toString('hex');

      console.log(`Sending signed tx: ${serializedTxHex.toString('hex')}`);
      this.firebase.logTokenPurchaseTxSent(userAddress, serializedTxHex.toString('hex'));

      const receipt = await this.web3js.eth.sendSignedTransaction('0x' + serializedTxHex.toString('hex'))
        .on('transactionHash', hash => {
          successCallback(hash);
        });
      console.log(`Receipt: \n${JSON.stringify(receipt, null, '\t')}`);
      this.firebase.logTokenPurchaseSuccess(userAddress, JSON.stringify(receipt));
      return Promise.resolve(receipt);
    } catch (e) {
      this.firebase.logTokenPurchaseError(userAddress, JSON.stringify(e));
      return Promise.reject(null);
    }
  }
}
