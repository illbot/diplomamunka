import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-eight',
  templateUrl: './eight.component.html',
  styleUrls: ['./eight.component.scss'],
})
export class EightComponent implements OnInit {

  @Input() activityLevel: string;
  @Output() activityLevelChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  handleActivityLevelChange(ev) {
    this.activityLevel = ev.detail.value;
    this.activityLevelChange.emit(this.activityLevel);
  }

}
