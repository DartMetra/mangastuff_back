import { Injectable, Scope } from '@nestjs/common';
import * as firebase from 'firebase-admin';

@Injectable({ scope: Scope.DEFAULT })
export class FirebaseService {
  private readonly firebase: firebase.app.App;
  constructor() {
    console.log('FIREBASE');

    console.log('INIT FIREBASE');
    this.firebase = firebase.initializeApp({
      credential: firebase.credential.cert('src/firebase/firebase.json'),
    });
  }

  public admin() {
    return this.firebase;
  }

  public auth() {
    return this.firebase.auth();
  }

  public messaging() {
    return this.firebase.messaging();
  }

  public database() {
    return this.firebase.database();
  }

  public firestore() {
    return this.firebase.firestore();
  }
}
