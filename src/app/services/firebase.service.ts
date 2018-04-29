import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Coin } from '../classes/coin';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export enum Actions {
  ACC_RETRIEVAL_PKEY = 'Account_retrieved_via_public_key',

  TOKEN_PURCHASE_TX_CREATED = 'Token_purchase_initialised',
  TOKEN_PURCHASE_TX_SENT = 'Token_purchase_tx_sent',
  TOKEN_PURCHASE_SUCCESS = 'Token_purchase_success',
  TOKEN_PURCHASE_ERROR = 'Token_purchase_error',

  EXTERNAL_URL_CLICKED = 'External_url_clicked'
}


@Injectable()
export class FirebaseService {

  coins = new BehaviorSubject<Coin[]>(null);
  coins$ = this.coins.asObservable();

  constructor(private http: Http, private db: AngularFirestore) {
    db.collection<Coin>('coins').valueChanges().subscribe(res => {
      this.coins.next(res);
    });
  }

  private logAction(userAddr: string, actionType: Actions, contents: object = {}) {
    const id = this.db.createId();
    const action = Object.assign({ id, userAddr, action: actionType }, contents);
    console.log(JSON.stringify(action));
    this.db.collection('actions').doc(id).set(action);
  }

  logAccountRetrieval(userAddr: string) {
    this.logAction(userAddr, Actions.ACC_RETRIEVAL_PKEY);
  }

  logTokenPurchaseTxCreated(userAddr: string, transaction: any) {
    this.logAction(userAddr, Actions.TOKEN_PURCHASE_TX_CREATED, { transaction });
  }

  logTokenPurchaseTxSent(userAddr: string, transactionHex: string) {
    this.logAction(userAddr, Actions.TOKEN_PURCHASE_TX_SENT, { transactionHex });
  }

  logTokenPurchaseSuccess(userAddr: string, receipt: string) {
    this.logAction(userAddr, Actions.TOKEN_PURCHASE_SUCCESS, { receipt });
  }

  logTokenPurchaseError(userAddr: string, error: string) {
    this.logAction(userAddr, Actions.TOKEN_PURCHASE_ERROR, { error });
  }

  logExternalUrlClicked(userAddr: string, url: string) {
    this.logAction(userAddr, Actions.EXTERNAL_URL_CLICKED, { url });
  }

}
