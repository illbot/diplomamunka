import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController,
  ) { }


  async showErrorToast(message:string){
    const toast = await this.toastController.create({
      message: message,
      duration:3000,
      position:'top',
      icon:'alert-circle-outline',
      color: 'danger'
    })

    await toast.present();
  }

  async showSuccessToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration:3000,
      position:'top',
      icon:'sparkles-outline',
      color: 'success'
    })

    await toast.present();
  }
}
