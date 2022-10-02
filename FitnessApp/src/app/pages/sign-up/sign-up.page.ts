import { Component, OnInit } from '@angular/core';
import { SignUpWrapperComponent } from './sign-up-wrapper/sign-up-wrapper.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  nextComponent = SignUpWrapperComponent;

  constructor() { }

  ngOnInit() {
  }

}
