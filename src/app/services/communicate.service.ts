import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommunicateService {

  // private mouseService = new BehaviorSubject<boolean>(null);
  // public mouseService$ = this.mouseService.asObservable();

  private terminalService = new BehaviorSubject<boolean>(null);
  public terminalService$ = this.terminalService.asObservable();

  constructor() { }

  // simulateMouse(){
  //   this.mouseService.next(true);
  // }
  
  // stopSimulateMouse(){
  //   this.mouseService.next(false);
  // }


  openTerminal(){
    this.terminalService.next(true);
  }
  
  closeTerminal(){
    this.terminalService.next(false);
  }

}
