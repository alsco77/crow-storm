import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { AngularDraggableModule } from 'angular2-draggable';
import { CountUpModule } from 'countup.js-angular2';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';

import { ServicesModule } from './services/services.module';

import { AppComponent } from './app.component';
import { BackdropComponent } from './backdrop/backdrop.component';
import { BirdsComponent } from './birds/birds.component';
import { TerminalComponent } from './terminal/terminal.component';
import { WeiToEthPipe } from './classes/wei-to-eth.pipe';
import { GameComponent } from './terminal/game/game.component';
import { CrowBalanceComponent } from './crow-balance/crow-balance.component';


@NgModule({
  declarations: [
    AppComponent,
    BackdropComponent,
    BirdsComponent,
    TerminalComponent,
    WeiToEthPipe,
    GameComponent,
    CrowBalanceComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularDraggableModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    ServicesModule,
    FormsModule,
    CountUpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
