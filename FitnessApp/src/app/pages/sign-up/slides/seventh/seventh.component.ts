import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-seventh-slide',
  templateUrl: './seventh.component.html',
  styleUrls: ['./seventh.component.scss'],
})
export class SeventhComponent implements OnInit {

  @Input() weight:number;
  @Output() weightChange = new EventEmitter<number>(); 

  constructor() { }

  ngOnInit() {}

  handleChange(ev){
    this.weightChange.emit(ev.target.value);
  }
}
