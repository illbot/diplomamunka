import { Component, OnInit } from '@angular/core';
import { PersonalGoalsService } from 'src/app/services/personal-goals.service';
import { PersonalGoals } from 'src/app/shared/datatype/datatypes';

@Component({
  selector: 'app-main-tab',
  templateUrl: './main-tab.component.html',
  styleUrls: ['./main-tab.component.scss'],
})
export class MainTabComponent implements OnInit {

  constructor(
    private personalGoalsService: PersonalGoalsService
  ) { }
  
  personalGoals: PersonalGoals;

  ngOnInit() {
    this.getPersonalGoals();
  }

  getPersonalGoals(){
    this.personalGoalsService.getPersonalGoals().then((goals)=>{
      this.personalGoals = goals;
    })
  }

}
