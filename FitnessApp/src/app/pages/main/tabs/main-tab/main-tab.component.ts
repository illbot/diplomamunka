import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { HealthMetricsService } from 'src/app/services/health-metrics.service';
import { PersonalGoalsService } from 'src/app/services/personal-goals.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { PersonalGoals } from 'src/app/shared/datatype/datatypes';


@Component({
  selector: 'app-main-tab',
  templateUrl: './main-tab.component.html',
  styleUrls: ['./main-tab.component.scss'],
})
export class MainTabComponent implements OnInit, AfterViewInit {
  calorieNeed = 2000;
  actualCalories = 0;
  nutrientNeeds = {
    protein: 0,
    carbohydrates: 0,
    fat: 0
  }

  gauge: any = {
    max: this.calorieNeed,
    value: 0,
  };
  personalGoals: PersonalGoals;


  constructor(
    private personalGoalsService: PersonalGoalsService,
    private healthMetricsService: HealthMetricsService,
    private recipeService: RecipeService
  ) { }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    this.initializeGauge();
    this.getPersonalGoals();
    this.getEatenFoodCalories();

    this.recipeService.eatingObservable.subscribe((plusCalorie)=>{
      this.actualCalories += plusCalorie;
    });
  }

  getEatenFoodCalories(){
    this.recipeService.getEatenFoodCalories().then((calories) => {
      this.actualCalories = calories;
    })
  }

  getPersonalGoals(){
    this.personalGoalsService.getPersonalGoals().then((goals)=>{
      this.personalGoals = goals;
      this.calorieNeed = this.healthMetricsService.calculateCalorieNeeds(this.personalGoals);
      this.updateGauge(this.calorieNeed);
      let result = this.healthMetricsService.calculateNutrientNeeds(this.calorieNeed);

      this.nutrientNeeds.protein = result.protein;
      this.nutrientNeeds.carbohydrates = result.carbohydrate;
      this.nutrientNeeds.fat = result.fat;
    })
  }


  initializeGauge(){
    this.gauge.max = 2200;
  }


  updateGauge(calorieNeed){
    this.gauge.max = calorieNeed;
  }


}
