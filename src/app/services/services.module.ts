import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { Web3Service } from './web3.service';
import { FirebaseService } from './firebase.service';
import { Utils } from './utils';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [

  ],
  providers: [
    FirebaseService,
    Web3Service,
    Utils
  ]
})
export class ServicesModule { }
