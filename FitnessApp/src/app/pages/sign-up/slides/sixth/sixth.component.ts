import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sixth-slide',
  templateUrl: './sixth.component.html',
  styleUrls: ['./sixth.component.scss'],
})
export class SixthComponent implements OnInit {

  @Input() weight:number;
  @Output() weightChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  handleChange(ev){
    this.weightChange.emit(Number(ev.target.value));
  }
}
