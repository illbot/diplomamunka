import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-second-slide',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss'],
})
export class SecondComponent implements OnInit {

  @Input() goal: string;
  @Output() goalChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  handleChange(ev:any){
    const goal = ev.target.value;
    this.goalChange.emit(goal)
  }
}
