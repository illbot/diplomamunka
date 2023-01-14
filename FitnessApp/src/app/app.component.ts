import { Component } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { environment as env } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { getAuth } from 'firebase/auth';
import { TranslateService } from '@ngx-translate/core';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { PersonalGoalsService } from './services/personal-goals.service';
import { RecipeService } from './services/recipe.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  app: FirebaseApp;
  analytics: Analytics;

  constructor(
    private authService: AuthService,
    private pGoalsService: PersonalGoalsService,
    private recipeService: RecipeService
    //private translate: TranslateService
  ) {
    this.initFirebase();
    this.initTranslate();
  }

  initFirebase(){
    this.app = initializeApp(env.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.authService.setAuth(getAuth(this.app));
    const firestore = getFirestore(this.app);
    const storage = getStorage(this.app, "gs://fitnessapp-7a114.appspot.com");

    this.authService.setFirestore(firestore);
    this.pGoalsService.setFirestore(firestore);
    this.recipeService.setFirestore(firestore);
    this.recipeService.setStorage(storage);
  }

  initTranslate(){
    //this.translate.addLangs(['en', 'hu']);
    //this.translate.setDefaultLang('en');
    //this.translate.use('en')
  }
}
