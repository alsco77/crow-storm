import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunicateService } from '../services/communicate.service';
import { AppState } from '../classes/app-state.enum';

import { Subscription } from 'rxjs/subscription'
import * as Granim from 'granim';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.css']
})
export class BackdropComponent implements OnInit, OnDestroy {


  granimInstance: Granim;
  appStateSubscription: Subscription;

  constructor(private comService: CommunicateService) {

  }

  ngOnInit(): void {
    this.granimInstance = new Granim({
      element: '#granim-canvas',
      direction: 'diagonal',
      opacity: [0.8, 0.8],
      stateTransitionSpeed: 2000,
      isPausedWhenNotInView: true,
      image: {
        source: 'assets/bg-forest.jpg',
        blendingMode: 'multiply',
        position: ['left', 'bottom'],
        stretchMode: ['stretch', 'stretch']
      },
      states: {
        'default-state': {
          gradients: [
            ['#42f4f4', '#274D25'], // green grey
            // ['#80d3fe', '#7ea0c4']  // blue grey
            ['#0963A2', '#053F6B']  // blue light blue
          ],
          transitionSpeed: 10000
        },
        'terminal-state': {
          gradients: [
            // ['#93201D', '#420200'], // red, dark red
            ['#f761a1', '#8c1bab'], // pink, opurple
            ['#DD6C0F', '#FFAB66'] // orange, light orange
          ],
          transitionSpeed: 10000
        },
        'game-state': {
          gradients: [
            ['#A9A8A8', '#030202'], // really light, light grey
            ['#787777', '#000000'] // dark grey, black
          ],
          transitionSpeed: 10000
        },
      }
    });

    this.appStateSubscription = this.comService.appState$.subscribe((state: AppState) => {
      if (state == AppState.terminal) {
        this.granimInstance.changeState('terminal-state');
      } else if (state == AppState.game) {
        this.granimInstance.changeState('game-state');
      } else if (state == AppState.home) {
        this.granimInstance.changeState('default-state');
      }
    })

  }

  ngOnDestroy(): void {
    this.appStateSubscription.unsubscribe();
  }

}
