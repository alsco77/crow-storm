import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Typed from 'typed.js';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements AfterViewInit {

  @ViewChild('cmdInput') cmdInput: ElementRef;

  allOutput: Array<Typed> = [];
  commands = ['~'];
  currentInput = '';

  showPrompt = false;
  interval: any;

  cursor = '_';

  prompt = '[c-c-c-c] $:';

  constructor() {
  }

  ngAfterViewInit() {
    this.addCommand('CROW STORM');
  }


  executeCommand() {
    this.showPrompt = false;
    const input = this.currentInput;
    this.currentInput = '';
    this.commands[this.allOutput.length] = input;
    setTimeout(() => { this.addCommand('done' + input); });
  }

  addCommand(output: string) {
    const add = '#output-' + this.allOutput.length;
    this.allOutput.push(new Typed(add, {
      strings: [output],
      typeSpeed: 40,
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

}
