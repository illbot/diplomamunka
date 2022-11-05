import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fifth-slide',
  templateUrl: './fifth.component.html',
  styleUrls: ['./fifth.component.scss'],
})
export class FifthComponent implements OnInit {

  @Input() height: number;
  @Output() heightChange = new EventEmitter<number>(); 

  constructor() { }

  ngOnInit() {}

  handleChange(ev){
    this.heightChange.emit(ev.target.value);
  }
}
