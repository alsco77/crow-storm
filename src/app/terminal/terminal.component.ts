import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Typed from 'typed.js';
import { Web3Service, EthAccount } from '../services/web3.service';
import { Utils } from '../services/utils';

export class Command {
  constructor(command: string) {
    this.containsCommand = command !== null;
    this.command = command;
  }
  containsCommand: boolean;
  command: string;
}

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements AfterViewInit {

  @ViewChild('cmdInput') cmdInput: ElementRef;

  allOutput: Array<Typed> = [];
  commands: Array<Command> = [new Command(null)];
  currentInput = '';

  // isExecutingCommand = false;
  showPrompt = false;
  interval: any;

  cursor = '_';

  prompt = '[c-c-c-c] $:';
  helpMessage = '';
  unlockAccHelpMessage = '';

  constructor(private service: Web3Service, private utils: Utils) {
  }

  ngAfterViewInit() {
    this.addOutput('CROW STORM');
  }


  async executeCommandAsync() {
    const input = this.currentInput;
    this.showPrompt = false;
    this.currentInput = '';

    this.addCommand(input);
    const output = await this.handleCommandAsync(input);
    this.addOutput(output);
  }

  addCommand(input: string) {
    this.commands[this.commands.length] = new Command(input);
  }

  async handleCommandAsync(arg: string): Promise<string> {
    arg = arg.trim();
    const args = arg.split(' ');
    let output = 'standard output';
    if (args.length) {
      switch (args[0].toLowerCase()) {
        case 'unlockaccount':
          if (args.length === 3 && args[1] === '-key' && this.isHexString(args[2])) {
            const account = await this.service.getAccountFromPKeyAsync(args[2]);
            if (account != null) {
              output = account.address;
            }
          }
          break;
      }
    }
    return Promise.resolve(output);
  }

  addOutput(output: string) {
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
          this.showPrompt = true;
          this.focusInput();
          // this.input = ViewChild('current-input)');
          // tslint:disable-next-line
          // let cursor = document.getElementsByClassName('typed-cursor');
          // while (cursor.length > 0) {
          //   cursor[0].parentNode.removeChild(cursor[0]);
          // }
        }
      }));
    });
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
