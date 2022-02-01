import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fadeIn, fadeInLeft, fadeInRight, rubberBand } from 'ngx-animate';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations : [
    trigger('fadeIn', [transition(':enter', useAnimation(fadeIn, { params: { timing: .5} }))]),
    trigger('rubber', [transition('* => *', useAnimation(rubberBand, {
      params: { timing: 1, delay: .2 }
    }))]),
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  registerForm!: FormGroup
  loginMode = 0
  loadingAuth = false
  constructor(private formBuilder: FormBuilder, public userService: UserServiceService) {
    this.userService.loadingAuth$.subscribe(
      (data) => {
        this.loadingAuth = data
      }
    )
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    })
    this.registerForm = this.formBuilder.group({
      registerTime: [new Date()],
      score: [0],
      name: [, [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    })
  }
  login() {
    this.userService.loginUser(this.loginForm.value)
  }
  register() {
    this.userService.registerUser(this.registerForm.value)
  }
}
