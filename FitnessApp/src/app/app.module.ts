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

@NgModule({
  declarations: [
    AppComponent,
    SignUpWrapperComponent,
    SecondComponent,
    FirstComponent
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
