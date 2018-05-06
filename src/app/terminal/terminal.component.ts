import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/subscription'

import { Web3Service, TxStatus, TxInfo } from '../services/web3.service';
import { FirebaseService } from '../services/firebase.service';
import { CommunicateService } from '../services/communicate.service';
import { Utils } from '../services/utils';

import { Command } from '../classes/command';
import { Web3LoadingStatus } from '../classes/web3-loading-status.enum';

import * as Typed from 'typed.js';
import { AppState } from '../classes/app-state.enum';
import { ENGINE_METHOD_DIGESTS } from 'constants';



@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements AfterViewInit, OnDestroy {

  @ViewChild('cmdInput') cmdInput: ElementRef;
  @ViewChild('terminalBody') terminalBody: ElementRef;

  allOutput: Array<Typed> = [];
  commands: Array<Command> = [new Command(null)];
  currentCommand = -1;
  currentInput = '';

  showPrompt = false;
  interval: any;

  shootingCrows = false;

  cursor = '_';

  web3State: Web3LoadingStatus;

  web3Subscription: Subscription;
  accountSubscription: Subscription;
  account;
  firstLoad = true;
  transactionPending = false;

  crowBalance: string;

  /* Terminal Messages */
  prompt = '[c-c-c-c] $:';
  welcomeMessage = 'Welcome to the CCCC - Crow Command Centre Control\nThe time has come to fight back against the pesky crows^1000\n\n' +
    'Crow Command Centre Controls loading...^500\n `Calculating storm differentials...`^800\n ' +
    '`Hooking up to the network...`^800\n'
    + '';
  invalidCommandMessage = 'Command not recognised\n';
  getHelpMessage = '`Enter "help" for a list of available commands or "shootcrows" to get into the action`';
  helpMessage = '\n\n `command: "shootcrows"\t(Take care of the damn crows)`^300\n' +
    '`command: "info"\t\t\t(What is going on?)`^300\n' +
    '`command: "balance"\t\t(Check your balance)`^300\n' +
    '`command: "purchasecrowcoins [amount]"\t\t(Purchase crow coins)`^300\n' +
    '`command: "checkconnection"\t\t\t(Check MetaMask connection)`^300\n' +
    '`command: "exit"\t\t\t(Close the command console)`^300\n' +
    '`command: "help"\t\t\t(Get help)`^300\n\n' +
    'Now lets take care of some crows!';
  infoMessage = 'A giant horde of crows is descending on Melbourne...\n' +
    'If we let them get in to the city it will be a disaster!\n' +
    'Use your skills to clear them out and you will be rewarded with Crow Coins^300\n' +
    'Now enter the command \"shootcrows\" and lets get to work!';
  shootCrowsHelpMessage = '`command: "shootcrows"`^400\n `Params: [-difficulty] ["easy", "medium", "hard"]`^400\n' +
    '`e.g. shootcrows -difficulty medium...`^400\n' +
    '`e.g. shootcrows`';
  loadingCrowsMessage = 'Lets go shooting!^400\n `Prepping equipment...`^400\n' +
    '`Setting up position...`^400\n\n ';
  unlockAccHelpMessage = '`command: "unlockaccount"`^400\n `Params: [-key] [pKey]`^400\n' +
    '`e.g. unlockaccount -key 0x23948729347892374...`';
  purchaseCoinsHelpMessage = '`command: "purchasecrowcoins [amount]"`^400\n' +
    '`e.g. purchasecrowcoins 800`';

  constructor(private service: Web3Service, private utils: Utils, private firebase: FirebaseService, private comService: CommunicateService) {

  }

  async ngAfterViewInit() {
    this.web3Subscription = this.service.web3Status$.subscribe((status: Web3LoadingStatus) => {
      console.log("Terminal: Web3Status: " + status);

      this.web3State = status;
      if (status == Web3LoadingStatus.complete) {
        if (this.firstLoad) {
          this.addOutput(this.welcomeMessage + '`<span style="color:green;">' + status + '</span>`^800\n\n' + this.getHelpMessage, true);
          // this.addOutput('', true);
          this.firstLoad = false;
        }
        this.accountSubscription = this.service.account$.subscribe(async (acc: string) => {
          if (acc != undefined) {
            this.account = acc;
            console.log("Terminal: account loaded: " + acc);
            const ethBalance = await this.service.getEthBalanceAsync();
            console.log("Terminal: eth balance: " + ethBalance);
            this.crowBalance = await this.service.getTokenBalanceAsync();
            console.log("Terminal: crow balance: " + this.crowBalance);

          }
        });
      } else if (status != null) {
        this.account = null;
        if (this.firstLoad) {
          this.firstLoad = false;
          this.addOutput(this.welcomeMessage + '`<span style="color:red;">' + status + '</span>`^800\n\n' + this.getHelpMessage, true);
        }
      }
    });
  }

  ngOnDestroy() {
    this.web3Subscription.unsubscribe();
    this.accountSubscription.unsubscribe();
  }

  closeTerminal() {
    this.shootingCrows = false;
    this.comService.setState(AppState.home);
  }

  async executeCommandAsync() {
    this.currentCommand = -1;
    if (this.showPrompt) {
      const input = this.currentInput;
      this.showPrompt = false;
      this.currentInput = '';

      this.addCommand(input);
      const output = await this.handleCommandAsync(input);
      if (output == null) {
        this.addOutput('');
      } else {
        this.addOutput(output, true);
      }
    }
  }

  addCommand(input: string) {
    this.commands[this.commands.length] = new Command(input);
  }

  async handleCommandAsync(arg: string): Promise<string> {
    arg = arg.trim();
    const args = arg.split(' ');
    let output = this.invalidCommandMessage + this.getHelpMessage;
    if (args.length) {
      switch (args[0].toLowerCase()) {
        case 'shootcrows':
          this.addOutput(this.loadingCrowsMessage);
          setTimeout(() => {
            this.shootingCrows = true;
            this.comService.setState(AppState.game);
          }, 3000);
          output = null;
          // }
          break;

        case 'info':
          output = this.infoMessage;
          break;
        case 'checkconnection':
          output = this.web3State + '^400\n'
          if (this.account) {
            output += 'Account: ' + this.account;
          }
          break;
        case 'balance':
          if (this.web3State == Web3LoadingStatus.complete) {
            const balWei = await this.service.getEthBalanceAsync();
            const crowWei = await this.service.getTokenBalanceAsync();
            if (balWei && crowWei) {
              const balEth = await this.service.convertWeiToEth(balWei);
              const balCrow = await this.service.convertWeiToEth(crowWei);
              output = '\nEther balance:\t\t' + balEth + ' ETH\n' +
                'CrowCoin balance:\t' + balCrow + ' CROW';
            } else {
              output = '\nUnable to retrieve balance';
            }
            break;
          }
          output = this.web3State;
          break;
        case 'purchasecrowcoins':
          if (this.web3State == Web3LoadingStatus.complete) {
            if (args.length == 2 && parseInt(args[1]) != NaN) {
              if (this.transactionPending) {
                output = 'Unable to purchase tokens until your previous deposit is complete';
                break;
              } else {

                this.addOutput('Please accept the request on MetaMask...')

                var count = await this.service.getNonce();
                this.service.purchaseTokensAsync(null, args[1], function () { });
                var txSubscription: Subscription;
                txSubscription = this.service.txStatus$.subscribe((txInfo: TxInfo) => {
                  if (txInfo != null) {
                    switch (txInfo.status) {
                      case TxStatus.hash:
                        if (txInfo.nonce == count) {
                          this.addOutput('Purchase sent^200\nPlease wait...');
                        }
                        break;
                      case TxStatus.receipt:
                        if (txInfo.nonce == count) {
                          // this.addOutput('Awaiting confirmation...');
                          break;
                        }
                      case TxStatus.confirmed:
                        if (txInfo.nonce == count) {
                          this.addOutput('<span style="color:green">Purchase successful</span>', true);
                          txSubscription.unsubscribe();
                          count = 0;
                          break;
                        }
                      case TxStatus.error:
                        if (txInfo.nonce == count) {
                          this.addOutput('There was an <span class="color:red">error</span> in purchasing the Crow Coins', true);
                          txSubscription.unsubscribe();
                          count = 0;
                        }
                        break;
                      default:
                        break;
                    }
                  }
                });
                output = null;
                break;
              }
            } else {
              output = this.purchaseCoinsHelpMessage;
              break;
            }
          }
          output = this.web3State;
          break;
        case 'help':
          output = this.helpMessage;
          break;
        case 'exit':
          this.closeTerminal();
          break;
      }
    }
    return Promise.resolve(output);
  }

  addOutput(output: string = '', isLastOutput: boolean = false) {
    var scrollInterval = setInterval(() => {
      var elem = this.terminalBody.nativeElement;
      elem.scrollTop = elem.scrollHeight;
    }, 20);
    const index = this.commands.length;
    this.commands[index] = new Command(null);
    setTimeout(() => {
      const add = '#output-' + index;
      this.allOutput.push(new Typed(add, {
        strings: [output],
        typeSpeed: 20,
        backSpeed: 0,
        showCursor: false,
        loop: false,
        onComplete: () => {
          // this.addingOutput = false;
          clearInterval(scrollInterval);
          if (isLastOutput) {
            this.showPrompt = true;
            this.focusInput();
          }
        }
      }));
    }, 10);
  }

  onInput(event) {
    const commands = this.commands.filter(x => x.containsCommand);
    if (commands.length > 0) {
      if (event.keyCode == 38) { //up
        if (this.currentCommand == -1) {
          this.currentCommand = commands.length - 1;
        } else if (this.currentCommand > 0) {
          this.currentCommand -= 1;
        }
        if (this.currentCommand >= 0 && commands[this.currentCommand]) {
          this.currentInput = commands[this.currentCommand].command;
        }
      } else if (event.keyCode == 40) { //down
        if (this.currentCommand != -1) {
          this.currentCommand += 1;
          if (this.currentCommand >= commands.length) {
            this.currentCommand = -1;
            this.currentInput = '';
          } else {
            this.currentInput = commands[this.currentCommand].command;
          }
        }
      }
    }
  }

  async gameFinished(score) {
    this.shootingCrows = false;
    this.comService.setState(AppState.terminal);
    this.addOutput('\n<br/>Your sacrifice has been noted!^400\n To <span style="color:green">claim your ' + score +
      ' Crow Coins, accept the transaction on MetaMask</span>^800\n', false);
    setTimeout(async () => {
      var count = await this.service.getNonce();
      this.service.claimTokensAsync(score.toString());
      var txSubscription: Subscription;
      this.transactionPending = true;
      txSubscription = this.service.txStatus$.subscribe((txInfo: TxInfo) => {
        if (txInfo != null) {
          switch (txInfo.status) {
            case TxStatus.hash:
              if (txInfo.nonce == count) {
                this.addOutput('Depositing Coins into your wallet...', true);
              }
              break;
            case TxStatus.confirmed:
              if (txInfo.nonce == count) {
                this.transactionPending = false;
                count = 0;
                txSubscription.unsubscribe();
              }
              break;
            case TxStatus.error:
              if (txInfo.nonce == count) {
                this.transactionPending = false;
                this.addOutput('Maybe next time you will want the coins', true);
                count = 0;
                txSubscription.unsubscribe();
              }
              break;
            default:
              break;
          }
        }
      })
    }, 600);
  }

  inputBlur() {
    clearInterval(this.interval);
    this.cursor = '_';
  }

  focusInput() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.cursor === '') {
        this.cursor = '_';
      } else {
        this.cursor = '';
      }
    }, 500);
    this.cmdInput.nativeElement.focus();
  }

  private isHexString(str: string): boolean {
    if (str === '') {
      return true;
    }
    str = str.substring(0, 2) === '0x' ? str.substring(2).toUpperCase() : str.toUpperCase();
    const re = /^[0-9A-F]+$/g;
    return re.test(str);
  }
}
