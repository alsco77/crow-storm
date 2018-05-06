import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/subscription'

import { Web3Service } from '../services/web3.service';
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

  allOutput: Array<Typed> = [];
  commands: Array<Command> = [new Command(null)];
  currentInput = '';

  showPrompt = false;
  interval: any;

  shootingCrows = false;

  cursor = '_';

  web3State: Web3LoadingStatus;

  web3Subscription: Subscription;
  accountSubscription: Subscription;

  crowBalance: string;
  
  /* Terminal Messages */
  prompt = '[c-c-c-c] $:';
  welcomeMessage = 'Welcome to the CCCC - Crow Command Centre Control\nThe time has come to fight back against the pesky crows^1000\n\n' +
    'Crow Command Centre Controls loading...^500\n `Calculating storm differentials...`^1000\n ' +
    '`Calculating defense capabilities...`^1000\n\n'
    + '';
  invalidCommandMessage = 'Command not recognised\n';
  getHelpMessage = '`Enter "help" for a list of available commands`';
  helpMessage = '\n\n `command: "shootcrows"\t(Take care of the damn crows)`^400\n' +
  '`command: "info"\t\t\t(What is going on?)`^400\n' +
  '`command: "balance"\t\t(Check your balance)`^400\n' +
  '`command: "help"\t\t\t(Get help)`^400\n\n' +
    'Now lets take care of some crows!';
  infoMessage = 'A giant horde of crows is descending on Melbourne...\n' + 
    'If we let them get in to the city it will be a disaster!\n' +
    'Use your skills to clear them out and you will be rewarded with Crow Coins^300\n' +
    'Now enter the command \'shootcrows\' and lets take care of this problem!';
  shootCrowsHelpMessage = '`command: "shootcrows"`^400\n `Params: [-difficulty] ["easy", "medium", "hard"]`^400\n' +
    '`e.g. shootcrows -difficulty medium...`^400\n' +
    '`e.g. shootcrows`';
  loadingCrowsMessage = 'Lets go shooting!^400\n `Prepping equipment...`^400\n' +
      '`Setting up position...`^400\n\n ';
  unlockAccHelpMessage = '`command: "unlockaccount"`^400\n `Params: [-key] [pKey]`^400\n' +
    '`e.g. unlockaccount -key 0x23948729347892374...`';

  constructor(private service: Web3Service, private utils: Utils, private firebase: FirebaseService, private comService: CommunicateService) {
    
  }

  async ngAfterViewInit() {
    // this.addOutput(this.welcomeMessage + this.getHelpMessage, true);
    this.addOutput('Hi', true);
    this.web3Subscription = this.service.web3Status$.subscribe((status: Web3LoadingStatus) => {
      console.log("Terminal: Web3Status: " + status);
      this.web3State = status;
      if (status == Web3LoadingStatus.complete) {
        this.accountSubscription = this.service.account$.subscribe(async (acc: string) => {
          if (acc != undefined) {
            console.log("Terminal: account loaded: " + acc);
            const ethBalance = await this.service.getEthBalanceAsync();
            console.log("Terminal: eth balance: " + ethBalance);
            this.crowBalance = await this.service.getTokenBalanceAsync();
            console.log("Terminal: crow balance: " + this.crowBalance);

          }
        });
      } else if (status != null) {

      }
    });
  }

  ngOnDestroy() {
    this.web3Subscription.unsubscribe();
    this.accountSubscription.unsubscribe();
  }

  closeTerminal(){
    this.shootingCrows = false;
    this.comService.setState(AppState.home);
  }

  async executeCommandAsync() {
    if (this.showPrompt) {
      const input = this.currentInput;
      this.showPrompt = false;
      this.currentInput = '';

      this.addCommand(input);
      const output = await this.handleCommandAsync(input);
      if(output == null){
        this.addOutput('');
      }else{
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
        case 'help':
          output = this.helpMessage;
          break;
        case 'unlockaccount':
          if (args.length === 3 && args[1] === '-key' && this.isHexString(args[2])) {
            // const account = await this.service.getAccountFromPKeyAsync(args[2]);
            // if (account != null) {
            //   output = account.address;
            // }
          } else {
            this.addOutput(this.invalidCommandMessage);
            output = this.unlockAccHelpMessage;
          }
          break;
        case 'shootcrows':
          // if (args.length === 3 && args[1] === '-difficulty' )) {
          //   // const account = await this.service.getAccountFromPKeyAsync(args[2]);
          //   // if (account != null) {
          //   //   output = account.address;
          //   // }
          // } else {
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
        case 'balance':
          if(this.web3State == Web3LoadingStatus.complete){
            const balWei = await this.service.getEthBalanceAsync();
            const crowWei = await this.service.getTokenBalanceAsync();
            if(balWei && crowWei){
              const balEth = await this.service.convertWeiToEth(balWei);
              const balCrow = await this.service.convertWeiToEth(crowWei);
              output = '\nEther balance:\t\t' + balEth + ' ETH\n' +
              'CrowCoin balance:\t' + balCrow + ' CROW';
            }else{
              output = '\nUnable to retrieve balance';
            }
            break;
          }
          output = this.web3State;
          break;
        case 'help':
          output = this.helpMessage;
          break;
      }
    }
    return Promise.resolve(output);
  }

  addOutput(output: string = '', isLastOutput: boolean = false) {
    // while(this.addingOutput == true){}
    // this.addingOutput = true;
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
          if (isLastOutput) {
            this.showPrompt = true;
            this.focusInput();
          }
        }
      }));
    });
  }

  gameFinished(score){
    this.shootingCrows = false;
    this.comService.setState(AppState.terminal);
    this.addOutput('\nYour sacrifice has been noted!^400\n Would you like to claim your ' + score +
    ' Crow Coins? [Y]es or [N]o^400\n', true);
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
