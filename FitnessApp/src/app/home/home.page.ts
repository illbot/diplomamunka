import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  passwordVisibility:boolean = false;
  password: string = "";
  username: string = "";

  constructor() {}

  login(){
    console.log(this.password);
    console.log(this.username);
  }

  togglePasswordVisibility(){
    this.passwordVisibility = !this.passwordVisibility;
  }
}
