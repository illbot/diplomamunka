import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-first-slide',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
})
export class FirstComponent implements OnInit {
  @Input() name: string;
  @Output() nameChange = new EventEmitter<string>();

  @Input() email: string;
  @Output() emailChange = new EventEmitter<string>();

  @Input() password: string;
  @Output() passwordChange = new EventEmitter<string>();

  @Input() passwordAgain: string;
  @Output() passwordAgainChange = new EventEmitter<string>();

  constructor() { 
  }

  onNameChange(name: any){
    this.nameChange.emit(name.target.value);
  }

  onEmailChange(name: any){
    this.emailChange.emit(name.target.value);
  }

  onPasswordChange(name: any){
    this.passwordChange.emit(name.target.value);
  }

  onPasswordAgainChange(name: any){
    this.passwordAgainChange.emit(name.target.value); 
  }

  ngOnInit() {}

}
