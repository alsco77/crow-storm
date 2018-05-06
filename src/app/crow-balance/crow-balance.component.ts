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
export class CrowBalanceComponent {


  web3Subscription: Subscription;
  appStateSubscription: Subscription;
  coinsAddedSubscription: Subscription;
  accountSubscription: Subscription;

  terminalIsOpen = false;
  isLoaded = false;
  crowBalance: number;

  constructor(private service: Web3Service, private comService: CommunicateService) {
    this.web3Subscription = this.service.web3Status$.subscribe(async (status: Web3LoadingStatus) => {
      if (status == Web3LoadingStatus.complete) {
        this.accountSubscription = this.service.account$.subscribe(async (acc: string) => {
          if (acc != undefined) {
            const crowBalanceWei = await this.service.getTokenBalanceAsync();
            const crowBalanceString = await this.service.convertWeiToEth(crowBalanceWei);
            this.crowBalance = parseInt(crowBalanceString);
            this.coinsAddedSubscription = this.comService.coinsAdded$.subscribe((amount: number) => {
              this.crowBalance += amount;
            });
          }else{
            this.unsubscribeIfUndefined(this.coinsAddedSubscription);
            this.crowBalance = null;
          }
        });
      } else {
        this.unsubscribeIfUndefined(this.accountSubscription);
        this.unsubscribeIfUndefined(this.coinsAddedSubscription);
        this.crowBalance = null;
      }
    });
    this.appStateSubscription = this.comService.appState$.subscribe((state: AppState) => {
      if (state == AppState.terminal || state == AppState.game) {
        setTimeout(() => {
          this.terminalIsOpen = true;
        }, 3000);
      } else {
        this.terminalIsOpen = false;
      }
    })
    // this.isLoaded = true;

  }

  // async ngAfterViewInit() {


  // }

  unsubscribeIfUndefined(subscription: Subscription){
    if(subscription != undefined){
      subscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeIfUndefined(this.appStateSubscription);
    this.unsubscribeIfUndefined(this.web3Subscription);
    this.unsubscribeIfUndefined(this.accountSubscription);
    this.unsubscribeIfUndefined(this.coinsAddedSubscription);
  }

}
