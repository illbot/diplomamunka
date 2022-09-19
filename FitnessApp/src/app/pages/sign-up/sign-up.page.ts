import { Component, OnInit } from '@angular/core';
import { FirstComponent } from './first/first.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  nextComponent = FirstComponent;
  
  constructor() { }

  ngOnInit() {
  }

}
