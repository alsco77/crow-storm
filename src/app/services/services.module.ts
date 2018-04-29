import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './web3.service';
import { FirebaseService } from './firebase.service';
import { Utils } from './utils';

@NgModule({
  imports: [
    CommonModule
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
