import { Component, OnInit, ViewChild } from '@angular/core';
import  SwiperCore, { Virtual } from 'swiper'
import { SwiperComponent } from 'swiper/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';


SwiperCore.use([Virtual])

interface UserData{
  name:string,
  emailAdress: string,
  password: string,
  passwordAgain: string
}

@Component({
  selector: 'app-sign-up-wrapper',
  templateUrl: './sign-up-wrapper.component.html',
  styleUrls: ['./sign-up-wrapper.component.scss'],
})
export class SignUpWrapperComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  swiperConfig = {
    slidesPerView : 1,
    spaceBetween:50,
    effect: "fade",
    virtual: true,
  }
  userData:UserData = {
    name: "",
    emailAdress: "",
    password: "",
    passwordAgain: ""
  };

  registerLoading:HTMLIonLoadingElement;

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    ) { 
      this.loadingCtrl.create({
        message: 'Register...'
      }).then(res=> this.registerLoading = res);
  }

  ngOnInit() {}

  async slideNext(){
    //console.log(this.swiper.swiperRef.realIndex); // get actual

    if(this.swiper.swiperRef.isBeginning){ // First register slide
      //TODO: check user inputs
      this.registerLoading.present(); // open loader
      this.createAccount().then((result)=>{
        if(result.isSuccess){
          this.showSuccessToast("Sikeres regisztráció!")
          this.swiper.swiperRef.slideNext(100);
        } else {
          if(result.message === "auth/email-already-in-use") 
            this.showErrorToast("Nem sikerült a regisztráció!");

        }
        this.registerLoading.dismiss(); // close loader
      })

    } else if (this.swiper.swiperRef.isEnd) { // Last slide
      //TODO: navigate to new page
    } else {
      this.swiper.swiperRef.slideNext(100);
    }
  }

  slidePrev(){
    this.swiper.swiperRef.slidePrev(100);
  }

  createAccount():Promise<any> {
    return this.authService.registerEmailPassword(
      this.userData.emailAdress,
      this.userData.password)
  }

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
