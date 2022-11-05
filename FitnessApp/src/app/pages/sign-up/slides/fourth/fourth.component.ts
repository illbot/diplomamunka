import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {format, parseISO} from 'date-fns';

@Component({
  selector: 'app-fourth-slide',
  templateUrl: './fourth.component.html',
  styleUrls: ['./fourth.component.scss'],
})
export class FourthComponent implements OnInit {

  @Input() birthDate: string;
  @Output() birthDateChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  handleChange(ev){
    console.log(ev.target.value);
    const date = this.formatDateTime(ev.target.value);
    this.birthDateChange.emit(date);
  }

  formatDateTime(datetime:string):string{
    return format(parseISO(datetime), 'yyyy-MM-dd')
  }
}
