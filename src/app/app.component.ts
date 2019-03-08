import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommunicateService } from '../app/services/communicate.service';
import * as Typed from 'typed.js';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from './classes/app-state.enum';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {


  title: Typed;
  subtitle: Typed;
  showButton: boolean;

  terminalOpen = false;
  bounceIn = false;
  bounceInTerminal = false;
  terminalSubscription: Subscription;

  constructor(private comService: CommunicateService) {

  }

  ngOnInit() {
    
    this.terminalSubscription = this.comService.appState$.subscribe((state: AppState) => {
      if (state == AppState.terminal || state == AppState.game) {
        this.terminalOpen = true;
      } else {
        if(this.terminalOpen){
          this.bounceIn = true;
          this.bounceInTerminal = false;
          this.terminalOpen = false;
        }
      }
    });
    console.log("AppComponent: Initiatlising title");
    this.initTitle();
    if (localStorage.getItem('hasOpened') === 'true') {
      setTimeout(() => {
        this.showButton = true;
      }, 1000);
    }
  }

  ngOnDestroy() {
    this.terminalSubscription.unsubscribe();
  }

  initTitle() {
    this.title = new Typed('#title', {
      strings: ['<h4>CROW STORM</h4>'],
      typeSpeed: 110,
      backSpeed: 0,
      showCursor: false,
      loop: false,
      onComplete: () => {
        this.subtitle = new Typed('#subtitle', {
          strings: ['Melbourne is under attack from a storm of pesky crows!', 'Help get rid of them and earn some crow coins',
            'Ka-kawwwwwww Ka-kawwwwwwww'],
          typeSpeed: 30,
          backSpeed: 30,
          loop: true,
          fadeOut: true,
          onComplete: () => {
            this.showButton = true;
          }
        });
      }
    });
  }

  openTerminal() {
    this.comService.setState(AppState.terminal);
    setTimeout(() => {
      this.bounceInTerminal = true;
    }, 500);
    localStorage.setItem('hasOpened', 'true');
  }

}
