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

  actualNutrients = {
    protein: 0,
    carbohydrates: 0,
    fat: 0
  }

  nutrientNeeds = {
    protein: 0,
    carbohydrates: 0,
    fat: 0
  }

  thresholdConfig = {
    '0': {color: '#488AFF'},
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

    this.recipeService.eatingObservable.subscribe((macros)=>{
      this.actualCalories += Math.round(macros.calories);
      this.actualNutrients.carbohydrates += Math.round(macros.carbohydrates);
      this.actualNutrients.protein += Math.round(macros.protein);
      this.actualNutrients.fat += Math.round(macros.total_fat);
    });
  }

  getEatenFoodCalories(){
    this.recipeService.getEatenFoodCalories().then((macros) => {
      this.actualCalories = Math.round(macros.calories);
      this.actualNutrients.carbohydrates = Math.round(macros.carbohydrates);
      this.actualNutrients.protein = Math.round(macros.protein);
      this.actualNutrients.fat = Math.round(macros.total_fat);
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
    const valueEightyPercent = calorieNeed * 0.8;
    this.thresholdConfig[valueEightyPercent]={color: '#FF2929'}
  }


}
