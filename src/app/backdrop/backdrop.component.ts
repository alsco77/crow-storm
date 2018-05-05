import { Component, OnInit } from '@angular/core';

import * as Granim from 'granim';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.css']
})
export class BackdropComponent implements OnInit {


  granimInstance: Granim;

  constructor() { }

  ngOnInit() {
    this.granimInstance = new Granim({
      element: '#granim-canvas',
      direction: 'diagonal',
      opacity: [0.8, 0.8],
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
            ['#42f4f4', '#556270'], // green grey
            ['#80d3fe', '#7ea0c4']  // blue grey
          ],
          transitionSpeed: 10000
        },
        'console-state': {
          gradients: [
            ['#ffffff', '#ffffff'],
            ['#000000', '#000000']
          ],
          transitionSpeed: 10000
        },
      }
    });

    // this.granimInstance.changeState('violet-state');

  }

}
