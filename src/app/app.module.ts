import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material';
import { AngularDraggableModule } from 'angular2-draggable';

import { ServicesModule } from './services/services.module';

import { AppComponent } from './app.component';
import { BackdropComponent } from './backdrop/backdrop.component';
import { BirdsComponent } from './birds/birds.component';
import { TerminalComponent } from './terminal/terminal.component';


@NgModule({
  declarations: [
    AppComponent,
    BackdropComponent,
    BirdsComponent,
    TerminalComponent
  ],
  imports: [
    AngularDraggableModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
