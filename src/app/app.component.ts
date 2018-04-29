import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Typed from 'typed.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  title: Typed;
  subtitle: Typed;
  loadingComplete: boolean;

  ngOnInit() {
    this.initTitle();
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
          strings: ['Melbourne is under attack from a storm of pesky crows!', 'Help get rid of them and you might earn some crow coins',
            'Ka-kawwwwwww Ka-kawwwwwwww'],
          typeSpeed: 30,
          backSpeed: 30,
          loop: true,
          fadeOut: true,
          onComplete: () => {
            this.loadingComplete = true;
          }
        });
      }
    });
  }
}
