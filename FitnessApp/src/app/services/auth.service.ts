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

  loginEmailPassword(email, password){
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential)=>{
        console.log(userCredential); // TODO: navigate to new 
      })
      .catch((error)=>{
        console.log(error.message);
      });
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
