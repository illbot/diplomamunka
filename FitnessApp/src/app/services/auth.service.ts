import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, Auth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;
  constructor() {
  }

  setAuth(auth:Auth){
    this.auth=auth;
  }

  async loginEmailPassword(email, password){
    let loggedIn = false
    await signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential)=>{
        loggedIn = true;
      })
      .catch((error)=>{
        loggedIn = false;
      });
    return loggedIn;
  }

  async isSignedIn(){
    let signedIn = false 
    await this.auth.onAuthStateChanged((user)=>{
      if(user){
        signedIn = true
      } else {
        signedIn = false
      }
    })
    return signedIn;
  }

  async registerEmailPassword(email, password): Promise<any>{
    let result = {
      isSuccess: false,
      message: ""
    };

    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential)=>{
        const user = userCredential.user;

        result.isSuccess = true;
      })
      .catch((error)=>{
        result.isSuccess = false;
        result.message = error.code;
      });

    return result;
  }
}
