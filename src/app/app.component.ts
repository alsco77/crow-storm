import { Component, OnInit } from '@angular/core';
import * as Granim from 'granim';
import * as Typed from 'typed.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  granimInstance: Granim;
  title: Typed;
  subtitle: Typed;

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
            ['#3dffa7', '#556270'], // green grey
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

    this.title = new Typed('#title', {
      strings: ['<h4>CROW STORM</h4>'],
      typeSpeed: 110,
      backSpeed: 0,
      showCursor: false,
      loop: false,
      onComplete: () => {
        this.subtitle = new Typed('#subtitle', {
          strings: ['Melbourne is under attack from a storm of pesky crows!', 'Help get rid of them and you might earn some crow coins',
          'Ka-kawwwwwwwwww Ka-kawwwwwwwwww'],
          typeSpeed: 30,
          backSpeed: 30,
          loop: true,
          fadeOut: true
        });
      }
    });

    // this.granimInstance.changeState('violet-state');
  }
}
