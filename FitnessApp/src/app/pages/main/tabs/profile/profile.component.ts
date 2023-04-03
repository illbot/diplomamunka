import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PersonalGoalsService } from 'src/app/services/personal-goals.service';
import { ToastService } from 'src/app/services/toast.service';
import { PersonalGoals } from 'src/app/shared/datatype/datatypes';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  personalGoals: PersonalGoals;
  isLoadingPersonalGoals: boolean = false;
  newPersonalGoals = {
    goal: '',
    goalWeight: 0,
    currentWeight: 0,
    activityLevel: ''
  }

  //modal testing
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name:string;
  @ViewChild(IonModal) modal: IonModal;

  personalGoalsSubscription: Subscription;


  constructor(
    private personalGoalsService: PersonalGoalsService,
    private toastService: ToastService,
    private authService: AuthService,
    private routing: Router
  ) {
    this.personalGoalsSubscription = this.personalGoalsService.personalGoalsObserver$.subscribe(value=>{
      if(value)
        console.log('profile tap subscription')
        this.getPersonalGoals();
    })
  }

  ngOnDestroy(): void {
    this.personalGoalsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.getPersonalGoals();
  }

  getPersonalGoals(){
    this.isLoadingPersonalGoals = true;
    this.personalGoalsService.getPersonalGoals().then((goals)=>{
      this.personalGoals = goals;
      this.isLoadingPersonalGoals = false;

      this.newPersonalGoals.goal = goals.goal;
      this.newPersonalGoals.currentWeight = goals.currentWeight;
      this.newPersonalGoals.goalWeight = goals.goalWeight;

      console.log(this.personalGoals);
    })
    .catch((error)=>{
      this.toastService.showErrorToast(error.message);
    })
  }

  handleGoalChange(ev){
    this.newPersonalGoals.goal = ev.detail.value;
  }

  handleCurrentWeightChange(ev){
    this.newPersonalGoals.currentWeight = Number(ev.detail.value);
  }

  handleGoalWeightChange(ev){
    this.newPersonalGoals.goalWeight = Number(ev.detail.value);
  }

  handleActivityLevelChange(ev){
    this.newPersonalGoals.activityLevel = ev.detail.value;
  }

  // MODAL THINGS
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.personalGoals.goal = this.newPersonalGoals.goal;
    this.personalGoals.goalWeight = this.newPersonalGoals.goalWeight;
    this.personalGoals.currentWeight = this.newPersonalGoals.currentWeight;
    this.personalGoals.activityLevel = this.newPersonalGoals.activityLevel;

    this.personalGoalsService.savePersonalGoals(this.personalGoals).then(res=>{
      if(res){
        this.toastService.showSuccessToast("Personal goals saved!")
      } else {
        this.toastService.showErrorToast("Error while saving personal goals")
      }
    });

    this.modal.dismiss(this.name, 'confirm');
  }

  onLogoutClick() {
    this.authService.logOut().then((res)=>{
      if(res){
        this.toastService.showSuccessToast("Logged out!");
        this.routing.navigate(['home']);
      } else {
        this.toastService.showErrorToast("Log out failed!");
      }
    })
  }
}
