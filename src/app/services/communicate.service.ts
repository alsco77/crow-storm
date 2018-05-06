import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../classes/app-state.enum'

@Injectable()
export class CommunicateService {

  private appState = new BehaviorSubject<AppState>(null);
  public appState$ = this.appState.asObservable();


  private coinsAdded = new Subject<number>();
  public coinsAdded$ = this.coinsAdded.asObservable();

  constructor() { }

  setState(state: AppState){
    this.appState.next(state);
  }

  addCoins(amount: number){
    this.coinsAdded.next(amount);
  }
}
