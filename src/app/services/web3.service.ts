import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Utils } from './utils';
import { FirebaseService } from './firebase.service';

const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

// tslint:disable-next-line
const CrowdsaleAbi = [{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"capReached","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_rate","type":"uint256"},{"name":"_cap","type":"uint256"},{"name":"_token","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"}];


export class EthAccount {
  address: string;
  privateKey: string;
  signTransaction: Function;
  sign: Function;
  encrypt: Function;
}

export class TransactionReceipt {
  status: string;
  transactionHash: string;
}


@Injectable()
export class Web3Service {

  public web3: any;

  private currentProvider = new BehaviorSubject<any>(null);
  public currentProvider$ = this.currentProvider.asObservable();

  public authenticatedAccount = new BehaviorSubject<EthAccount>(null);
  public authenticatedAccount$ = this.authenticatedAccount.asObservable();


  constructor(private utils: Utils, private firebase: FirebaseService) {
    if (typeof this.web3 !== 'undefined') {
      this.setProvider(this.web3.currentProvider);
    } else {
      this.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));
    }
  }

  setProvider(provider: any) {
    this.web3 = new Web3(provider);
    this.currentProvider.next(provider.host);
  }

  async getAccountFromPKeyAsync(pkey: string): Promise<EthAccount> {
    const acc = await this.web3.eth.accounts.privateKeyToAccount(pkey);
    if (acc != null) {
      this.authenticatedAccount.next(acc);
      this.firebase.logAccountRetrieval(acc.address);
    }
    return Promise.resolve(acc);
  }

  async getTokenBalanceAsync(userAddress: string, tokenAddr: string): Promise<string> {
    const parsedUserAddress = this.utils.getNakedAddress(userAddress);
    const functionHash = this.utils.getFunctionSignature('balanceOf(address)');
    // TODO - functionHash should be parsed to certain length
    const contractData = functionHash + '000000000000000000000000' + parsedUserAddress;
    const balanceHex = await this.web3.eth.call({
      to: tokenAddr,
      data: contractData
    });
    if (balanceHex) {
      return Promise.resolve(this.web3.utils.toBN(balanceHex).toString());
    }
    return Promise.reject(null);
  }

  async getEthBalanceAsync(userAddress: string): Promise<string> {
    // TODO  - confirm useraddress has 0x
    const balance = await this.web3.eth.getBalance(userAddress);
    if (balance) {
      console.log(balance);
      const tokens = this.web3.utils.toBN(balance).toString();
      console.log('Eth Owned: ' + this.web3.utils.fromWei(tokens, 'ether'));
      return Promise.resolve(tokens);
    }
    return Promise.reject(null);
  }

  async estimateGasAsync(rawTransaction: any) {
    const gasCost = await this.web3.eth.estimateGas(rawTransaction);
    console.log('Gascost: ' + gasCost);
    return Promise.resolve(gasCost);
  }

  async getPurchaseTokensTransaction(userAddress: string, saleContractAddress: string, weiAmountHex: string,
    gasPriceGwei: number, gasLimit: number): Promise<any> {
    userAddress = this.utils.prefixHex(userAddress);
    saleContractAddress = this.utils.prefixHex(saleContractAddress);

    const contract = new this.web3.eth.Contract(CrowdsaleAbi, saleContractAddress, {
      from: userAddress
    });

    const count = await this.web3.eth.getTransactionCount(userAddress);
    const chainId = await this.web3.eth.net.getId();

    const rawTransaction = {
      'from': userAddress,
      'nonce': '0x' + count.toString(16),
      'gasPrice': this.web3.utils.toHex(gasPriceGwei * 1e9),
      'gasLimit': this.web3.utils.toHex(gasLimit),
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

      const receipt = await this.web3.eth.sendSignedTransaction('0x' + serializedTxHex.toString('hex'))
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
