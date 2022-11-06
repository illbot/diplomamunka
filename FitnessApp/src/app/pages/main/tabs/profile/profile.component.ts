import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { PersonalGoalsService } from 'src/app/services/personal-goals.service';
import { ToastService } from 'src/app/services/toast.service';
import { PersonalGoals } from 'src/app/shared/datatype/datatypes';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  personalGoals: PersonalGoals;
  isLoadingPersonalGoals: boolean = false;
  
  //modal testing
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name:string;
  @ViewChild(IonModal) modal: IonModal;


  constructor(
    private personalGoalsService: PersonalGoalsService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.getPersonalGoals();
  }

  getPersonalGoals(){
    this.isLoadingPersonalGoals = true;
    this.personalGoalsService.getPersonalGoals().then((goals)=>{
      this.personalGoals = goals;
      this.isLoadingPersonalGoals = false;
      console.log(this.personalGoals);
    })
    .catch((error)=>{
      this.toastService.showErrorToast(error.message);
    })
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
    this.modal.dismiss(this.name, 'confirm');
  }
}
