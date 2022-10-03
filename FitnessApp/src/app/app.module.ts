import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignUpWrapperComponent } from './pages/sign-up/sign-up-wrapper/sign-up-wrapper.component';
import { SecondComponent } from './pages/sign-up/slides/second/second.component';
import { SwiperModule } from 'swiper/angular';
import { FirstComponent } from './pages/sign-up/slides/first/first.component';
import { MainPage } from './pages/main/main.page';
import { ThirdComponent } from './pages/sign-up/slides/third/third.component';
import { FourthComponent } from './pages/sign-up/slides/fourth/fourth.component';
import { FifthComponent } from './pages/sign-up/slides/fifth/fifth.component';
import { SixthComponent } from './pages/sign-up/slides/sixth/sixth.component';
import { SeventhComponent } from './pages/sign-up/slides/seventh/seventh.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpWrapperComponent,
    SecondComponent,
    FirstComponent,
    ThirdComponent,
    FourthComponent,
    FifthComponent,
    SixthComponent,
    SeventhComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SwiperModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
