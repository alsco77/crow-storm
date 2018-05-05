import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/subscription'

import { Web3Service } from '../services/web3.service';
import { CommunicateService } from '../services/communicate.service';
import { Web3LoadingStatus } from '../classes/web3-loading-status.enum';
import { AppState } from '../classes/app-state.enum';

@Component({
  selector: 'app-crow-balance',
  templateUrl: './crow-balance.component.html',
  styleUrls: ['./crow-balance.component.css']
})
export class CrowBalanceComponent implements AfterViewInit {


  web3Subscription: Subscription;
  appStateSubscription: Subscription;

  terminalIsOpen = false;
  isLoaded = false;
  crowBalance: string;

  constructor(private service: Web3Service, private comService: CommunicateService) {
    
  }

  async ngAfterViewInit() {this.web3Subscription = this.service.web3Status$.subscribe(async (status: Web3LoadingStatus) => {
    if (status == Web3LoadingStatus.complete) {
      this.crowBalance = await this.service.getTokenBalanceAsync();
    }
    else {
      this.crowBalance = null;
    }
  });
  this.appStateSubscription = this.comService.appState$.subscribe((state: AppState) => {
    if(state == AppState.terminal || state == AppState.game){
      setTimeout(() => {
        this.terminalIsOpen = true;
      }, 3000);
    }else{
      this.terminalIsOpen = false;
    }
  })
  this.isLoaded = true;
    
  }

  ngOnDestroy(): void {
    this.web3Subscription.unsubscribe();
    this.appStateSubscription.unsubscribe();
  }

}
