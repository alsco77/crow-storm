import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BackdropComponent } from './backdrop/backdrop.component';
import { BirdsComponent } from './birds/birds.component';


@NgModule({
  declarations: [
    AppComponent,
    BackdropComponent,
    BirdsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
