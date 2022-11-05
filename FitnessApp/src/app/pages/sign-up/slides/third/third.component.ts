import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-third-slide',
  templateUrl: './third.component.html',
  styleUrls: ['./third.component.scss'],
})
export class ThirdComponent implements OnInit {

  @Input() gender: string;
  @Output() genderChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  handleChange(ev){
    const gender = ev.target.value;
    this.genderChange.emit(gender);
  }
}
