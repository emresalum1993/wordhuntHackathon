import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { UserServiceService } from './services/user-service.service';
import { trigger, transition, useAnimation } from "@angular/animations";
import { rotateCubeToLeft } from "ngx-router-animations"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wordHunt';
  displayWelcome = true
  loadingAuth = true;
  constructor(private primengConfig: PrimeNGConfig, public userService: UserServiceService) {
    this.userService.loadingAuth$.subscribe(
      (data) => {
        this.loadingAuth = data
      }
    )
  }
  ngOnInit() {
    this.primengConfig.ripple = true;
    var prevLogIn = localStorage.getItem("user")
    console.log(prevLogIn)
    if (prevLogIn) {
      console.log(JSON.parse(prevLogIn))
      this.userService.silentLogin(JSON.parse(prevLogIn));
    }
  }
}
