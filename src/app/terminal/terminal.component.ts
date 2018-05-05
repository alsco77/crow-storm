import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/subscription'

import { Web3Service } from '../services/web3.service';
import { FirebaseService } from '../services/firebase.service';
import { CommunicateService } from '../services/communicate.service';
import { Utils } from '../services/utils';

import { Command } from '../classes/command';
import { Coin } from '../classes/coin';
import { Web3LoadingStatus } from '../classes/web3-loading-status.enum';

import * as Typed from 'typed.js';



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

  // isExecutingCommand = false;
  showPrompt = false;
  interval: any;
  // addingOutput = false;

  shootingCrows = false;

  cursor = '_';

  web3Subscription: Subscription;
  accountSubscription: Subscription;
  coinsSubscription: Subscription;
  coin: Coin;

  crowBalance: string;

  /* Terminal Messages */
  prompt = '[c-c-c-c] $:';
  welcomeMessage = 'Welcome to the CCCC - Crow Command Centre Control\nThe time has come to fight back against the pesky crows^1000\n\n' +
    'Crow Command Centre Controls loading...^500\n `Calculating storm differentials...`^1000\n ' +
    '`Calculating defense capabilities...`^1000\n\n'
    + '';
  invalidCommandMessage = 'Command not recognised\n';
  getHelpMessage = '`Enter "help" for a list of available commands`';
  helpMessage = '\n\n `command: shootcrows`^400\n' +
    '`command: help`^400\n\n' +
    'Now lets take care of some crows!';
  shootCrowsHelpMessage = '`command: "shootcrows"`^400\n `Params: [-difficulty] ["easy", "medium", "hard"]`^400\n' +
    '`e.g. shootcrows -difficulty medium...`^400\n' +
    '`e.g. shootcrows`';
  loadingCrowsMessage = 'Lets go shooting!^400\n `Prepping equipment...`^400\n' +
      '`Setting up position...`^400\n';
  unlockAccHelpMessage = '`command: "unlockaccount"`^400\n `Params: [-key] [pKey]`^400\n' +
    '`e.g. unlockaccount -key 0x23948729347892374...`';

  constructor(private service: Web3Service, private utils: Utils, private firebase: FirebaseService, private comService: CommunicateService) {
    
  }

  async ngAfterViewInit() {
    this.addOutput(this.welcomeMessage + this.getHelpMessage, true);
    // this.comService.simulateMouse();
    this.web3Subscription = this.service.web3Status$.subscribe((status: Web3LoadingStatus) => {
      console.log("Terminal: Web3Status: " + status);
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
    this.coinsSubscription.unsubscribe();
  }

  closeTerminal(){
    this.comService.closeTerminal();
  }

  async executeCommandAsync() {
    if (this.showPrompt) {
      const input = this.currentInput;
      this.showPrompt = false;
      this.currentInput = '';

      this.addCommand(input);
      const output = await this.handleCommandAsync(input);
      this.addOutput(output, output != null);
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
            this.shootingCrows = true;
            output = null;
          // }
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
