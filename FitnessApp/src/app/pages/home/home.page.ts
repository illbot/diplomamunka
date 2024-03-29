import { Component } from '@angular/core';
import { SignUpPage } from '../sign-up/sign-up.page';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { PersonalGoalsService } from 'src/app/services/personal-goals.service';
import { ToastService } from 'src/app/services/toast.service';

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
    private router: Router,
    private personalGoalsService: PersonalGoalsService,
    private toast: ToastService
  ) {
    // NOT WORKING
    this.authService.isSignedIn().then((isSignedIn)=>{
      if(isSignedIn){
        this.navigateToMain();
      }
    })
  }

  login(){
    this.authService.loginEmailPassword(this.username,this.password).then((res)=>{
      if(res) {
        this.navigateToMain();
      } else {
        this.toast.showErrorToast("Bad email or password!");
      }
    })
  }

  navigateToMain(){
    this.personalGoalsService.hasPersonalGoals().then((hasGoals)=>{
      if(hasGoals){
        this.router.navigate(['/main/home']);
      } else {
        this.router.navigate(['/sign-up'])
      }
    })
  }


  googleLogin(){
    // TODO google login
  }


  togglePasswordVisibility(){
    this.passwordVisibility = !this.passwordVisibility;
  }
}
