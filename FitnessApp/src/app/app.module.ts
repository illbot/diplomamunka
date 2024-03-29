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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
//import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import {HttpClient} from '@angular/common/http/index';
import { AddRecipeComponent } from './pages/main/tabs/recipe-tab/add-recipe/add-recipe.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EightComponent } from './pages/sign-up/slides/eight/eight.component';

//export function HttpLoaderFactory(http: HttpClient){
//  return new TranslateHttpLoader(http,"./assets/i18n",".json")
//}

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
    EightComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    /*TranslateModule.forChild({
      loader:{
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),*/
    AppRoutingModule,
    SwiperModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
