import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommunicateService {

  private mouseService = new BehaviorSubject<boolean>(null);
  public mouseService$ = this.mouseService.asObservable();

  constructor() { }

  simulateMouse(){
    this.mouseService.next(true);
  }
  
  stopSimulateMouse(){
    this.mouseService.next(false);
  }

}
