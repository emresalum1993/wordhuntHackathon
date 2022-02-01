import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from "primeng/inputtext";
import { RippleModule } from 'primeng/ripple';
import { PasswordModule } from 'primeng/password';
import { BadgeModule } from "primeng/badge";
import { AvatarModule } from 'primeng/avatar';
import { SpeedDialModule } from 'primeng/speeddial';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { CodeInputModule } from 'angular-code-input';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
//PrimeNG Components End
//Components & Services
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { GuessWordComponent } from './pages/guess-word/guess-word.component';
import { SmallHeaderComponent } from './components/small-header/small-header.component';
import { MultipleChoiceComponent } from './pages/multiple-choice/multiple-choice.component';
import { ImageWordComponent } from './components/image-word/image-word.component';
import { WrongTypeComponent } from './pages/wrong-type/wrong-type.component';
import { MyWordsComponent } from './pages/my-words/my-words.component';
import { SingleWordComponent } from './components/single-word/single-word.component';
import { ScoreBoardComponent } from './pages/score-board/score-board.component';
import { ScoreSingleComponent } from './components/score-single/score-single.component';
import { LearnWordComponent } from './pages/learn-word/learn-word.component';
import { LoginGuardService } from './services/login-guard.service';
//Components & Services End
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AvatarComponent,
    GuessWordComponent,
    SmallHeaderComponent,
    MultipleChoiceComponent,
    ImageWordComponent,
    WrongTypeComponent,
    MyWordsComponent,
    SingleWordComponent,
    ScoreBoardComponent,
    ScoreSingleComponent,
    LearnWordComponent
  ],
  imports: [
    BrowserModule,
    ToastModule,
    SelectButtonModule,
    AppRoutingModule,
    DialogModule,
    FormsModule,
    SidebarModule,
    SkeletonModule,
    BadgeModule,
    SpeedDialModule,
    CardModule,
    ButtonModule,
    HttpClientModule,
    TagModule,
    TabViewModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    CodeInputModule,
    PasswordModule,
    ImageModule,
    ReactiveFormsModule,
    InputTextModule,
    RippleModule,
    AvatarModule
  ],
  providers: [LoginGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
