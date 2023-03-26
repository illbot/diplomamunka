import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { Chart } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { HealthMetricsService } from 'src/app/services/health-metrics.service';
import { PersonalGoalsService } from 'src/app/services/personal-goals.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { ToastService } from 'src/app/services/toast.service';
import { PersonalGoals } from 'src/app/shared/datatype/datatypes';


@Component({
  selector: 'app-main-tab',
  templateUrl: './main-tab.component.html',
  styleUrls: ['./main-tab.component.scss'],
})
export class MainTabComponent implements OnInit, AfterViewInit, OnDestroy {

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

  @ViewChild(IonModal) modal: IonModal;

  personalGoalsSubscription: Subscription;
  eatingSubscription: Subscription;

  constructor(
    private personalGoalsService: PersonalGoalsService,
    private healthMetricsService: HealthMetricsService,
    private recipeService: RecipeService,
    private toast: ToastService,
  ) {

    this.eatingSubscription = this.recipeService.eatingObservable.subscribe((macros)=>{
      this.actualCalories += Math.round(macros.calories);
      this.actualNutrients.carbohydrates += Math.round(macros.carbohydrates);
      this.actualNutrients.protein += Math.round(macros.protein);
      this.actualNutrients.fat += Math.round(macros.total_fat);
    });

  }

  ngOnDestroy(): void {
    this.eatingSubscription.unsubscribe();
    this.personalGoalsSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.personalGoalsSubscription = this.personalGoalsService.personalGoalsObserver$.subscribe(value=>{
      console.log('main tab subscription');
      this.getPersonalGoals();
    })
  }

  ngOnInit() {
    this.initializeGauge();
    this.getPersonalGoals();
    this.getEatenFoodCalories();
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

  confirmUpdate() {
    this.modal.dismiss(null, 'update');
  }

  cancelUpdate() {
    this.modal.dismiss(null, 'cancel');
  }

  async onWillDismiss($event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'update') {
      const result = await this.personalGoalsService.savePersonalGoals(this.personalGoals);
      if(result) this.toast.showSuccessToast("Successfully saved!");
      else this.toast.showErrorToast("Something went wrong! :(");
    }
  }

}
