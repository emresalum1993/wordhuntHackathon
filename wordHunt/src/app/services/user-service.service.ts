import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  public loadingAuth$ = new Subject<any>();
  public loadingAuth = false
  public user$ = new Subject<any>();
  public user: any
  public loggedIn: boolean = false
  public userId: any
  constructor(private http: HttpClient, private router: Router) {

    this.loadingAuth$.subscribe((data) => {
      this.loadingAuth = data
    })
    this.user$.subscribe(
      (data: any) => {
        this.user = data
        if (data) {
          this.loggedIn = true
          this.loadingAuth$.next(false)
        }
      }
    )
  }
  loginUser(body: any) {
    this.loadingAuth$.next(true)
    this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/user/login`, body).subscribe(
      (data) => {
        this.loadingAuth$.next(false)
        this.user$.next(data.result)
        this.user = data.result
        if (data.result) {
          this.loggedIn = true
          this.userId = data.result._id
          localStorage.setItem("user", JSON.stringify(this.user))
          this.user.level = this.getLevel(this.user.score)
          this.router.navigate(["home"]);
        }
      }
    )
  }
  refreshUser() {
    var prevLogIn = localStorage.getItem("user")
    if (prevLogIn) {
      var body = JSON.parse(prevLogIn)
      body.isHash = true
      this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/user/login`, body).subscribe(
        (data) => {
          this.loadingAuth$.next(false)
          this.user$.next(data.result)
          this.user = data.result
          this.user.level = this.getLevel(this.user.score)
        }
      )
    }
  }
  silentLogin(body: any) {
    body.isHash = true
    this.loadingAuth$.next(true)
    this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/user/login`, body).subscribe(
      (data) => {
        this.loadingAuth$.next(false)
        this.user$.next(data.result)
        this.user = data.result
        if (data.result) {
          this.loggedIn = true
          this.userId = data.result._id
          localStorage.setItem("user", JSON.stringify(this.user))
          this.user.level = this.getLevel(this.user.score)
          this.router.navigate(["home"]);
        }
      }
    )
  }
  registerUser(body: any) {
    this.loadingAuth$.next(true)
    this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/user/register`, body).subscribe(
      (data) => {
        this.loadingAuth$.next(false)
        var body = data.result
        body.isHash = true
        this.loginUser(body)
      })
  }
  updateScore(score: number) {
    var body = {
      userId: this.userId,
      score: score
    }
    this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/user/incscore`, body).subscribe(
      (data) => {
        this.refreshUser();
      })
  }
  getRankWord() {
    return this.http.get<{ message: string, result: any }>(`${environment.apiUrl}/rank/word`)
  }
  public isLoggedIn() { return this.user; }
  getLevel(score: number) {
    return Math.floor(score / 100)
  }
}
