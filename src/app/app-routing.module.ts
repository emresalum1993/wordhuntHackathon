import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuessWordComponent } from './pages/guess-word/guess-word.component';
import { HomeComponent } from './pages/home/home.component';
import { LearnWordComponent } from './pages/learn-word/learn-word.component';
import { LoginComponent } from './pages/login/login.component';
import { MultipleChoiceComponent } from './pages/multiple-choice/multiple-choice.component';
import { MyWordsComponent } from './pages/my-words/my-words.component';
import { ScoreBoardComponent } from './pages/score-board/score-board.component';
import { WrongTypeComponent } from './pages/wrong-type/wrong-type.component';
import { LoginGuardService } from "./services/login-guard.service";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'guess', component: GuessWordComponent, canActivate: [LoginGuardService],data: {state:  'guess'}  },
  { path: 'multiple', component: MultipleChoiceComponent, canActivate: [LoginGuardService],data: {state:  'multi'}  },
  { path: 'wrong', component: WrongTypeComponent, canActivate: [LoginGuardService],data: {state:  'wrong'}  },
  { path: 'myWords', component: MyWordsComponent, canActivate: [LoginGuardService],data: {state:  'words'}  },
  { path: 'learn', component: LearnWordComponent, canActivate: [LoginGuardService],data: {state:  'learn'}  },
  { path: 'ladder', component: ScoreBoardComponent ,canActivate: [LoginGuardService],data: {state:  'ladder'} },
  { path: 'home', component: HomeComponent, canActivate: [LoginGuardService],data: {state:  'home'}  },
  { path: '', component: HomeComponent, canActivate: [LoginGuardService],data: {state:  'home'}  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
