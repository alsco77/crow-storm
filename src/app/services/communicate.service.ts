import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../classes/app-state.enum'

@Injectable()
export class CommunicateService {

  private appState = new BehaviorSubject<AppState>(null);
  public appState$ = this.appState.asObservable();

  constructor() { }

  setState(state: AppState){
    this.appState.next(state);
  }
}
