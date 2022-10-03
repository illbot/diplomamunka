import { Component } from '@angular/core';
import { SignUpPage } from '../sign-up/sign-up.page';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  passwordVisibility:boolean = false;
  password: string = "";
  username: string = "";

  signUpPage = SignUpPage;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(){
    console.log(this.password);
    console.log(this.username);

    this.authService.loginEmailPassword(this.username,this.password).then((res)=>{
      if(res) {
        this.router.navigate(['/sign-up'])
      } else {
        console.log("hiba")
      }
    })

  }

  googleLogin(){

  }


  togglePasswordVisibility(){
    this.passwordVisibility = !this.passwordVisibility;
  }
}
