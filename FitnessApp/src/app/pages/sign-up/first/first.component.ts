import { Component, OnInit } from '@angular/core';
import { SecondComponent } from '../second/second.component';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
})
export class FirstComponent implements OnInit {
  nextComponent = SecondComponent;
  constructor() { }

  ngOnInit() {}

}
