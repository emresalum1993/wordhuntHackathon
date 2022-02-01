import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
