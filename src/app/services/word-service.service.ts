import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginGuardService } from './login-guard.service';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class WordServiceService {
  public loadingPools$ = new Subject<any>();
  public pools$ = new Subject<any>();
  private pools: any
  public loadingAggregated$ = new Subject<any>()
  public aggregatedWords$ = new Subject<any>();
  public loadingHistory$ = new Subject<any>();
  public history$ = new Subject<any>();
  constructor(private http: HttpClient, private userService: UserServiceService) { }
  loadPool() {
    this.loadingPools$.next(true)
    this.http.get<{ message: string, result: any }>(`${environment.apiUrl}/pools/${this.userService.userId}`).subscribe(
      (data) => {
        this.loadingPools$.next(false)
        if (data.result) {
          this.pools = data.result
          this.pools$.next(data.result)
        }
        else {
          this.createPool();
        }
      })
  }

  createPool() {
    this.loadingPools$.next(true)
    var body = {
      userId: this.userService.userId,
      words: []
    }
    this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/pools/${this.userService.userId}`, body).subscribe(
      (data) => {
        this.loadingPools$.next(false)
        if (data.result) {
          this.pools$.next(data.result)
        }
      })
  }

  loadHistory() {
    this.loadingHistory$.next(true)
    this.http.get<{ message: string, result: any }>(`${environment.apiUrl}/history/${this.userService.userId}`).subscribe(
      (data) => {
        this.loadingHistory$.next(false)
        if (data.result) {
          this.history$.next(data.result)
        }
        else {
          this.createHistory();
        }
      })
  }
  loadAggregated() {
    this.loadingAggregated$.next(true)
    this.http.get<{ message: string, result: any }>(`${environment.apiUrl}/pools/user/aggregate`).subscribe(
      (data) => {
        this.loadingAggregated$.next(false)
        if (data.result) {
          this.aggregatedWords$.next(data.result)
        }
      })
  }

  createHistory() {
    this.loadingHistory$.next(true)
    var body = {
      userId: this.userService.userId,
      words: []
    }
    this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/history/${this.userService.userId}`, body).subscribe(
      (data) => {
        this.loadingHistory$.next(false)
        if (data.result) {

          this.history$.next(data.result)
        }
      })
  }

  translate(text: string, from: string, to: string) {
    var body = {
      from: from,
      to: [to],
      text: text
    }
    return this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/translate`, body)
  }

  saveToPool(body: any) {
    return this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/pools/user/add`, body)
  }
  deleteFromPool(_id: any) {
    var body = {
      userId: this.userService.userId,
      itemId: _id
    }
    return this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/pools/user/delete`, body)
  }
  saveToHistory(body: any) {
    return this.http.post<{ message: string, result: any }>(`${environment.apiUrl}/history/user/add`, body)
  }
  imgSearch(term: String) {
    return this.http.get<{ message: string, result: any }>(`${environment.apiUrl}/imagesearch/${term}`)
  }


  getRandomFromPool(sourceLang: any) {
    var filtered = this.pools.words.filter((f: any) => f.sourceLang == sourceLang)
    var randomSingle: any = filtered[Math.floor((Math.random() * filtered.length))]
    return randomSingle
  }
  getRandomChoicesFromPool(sourceLang: any) {
    var filtered = this.pools.words.filter((f: any) => f.sourceLang == sourceLang)
    var randomSingle: any = filtered[Math.floor((Math.random() * filtered.length))]
    filtered = filtered.filter((f: any) => f._id !== randomSingle._id)
    var randomChoice1: any = filtered[Math.floor((Math.random() * filtered.length))]
    filtered = filtered.filter((f: any) => f._id !== randomChoice1._id)
    var randomChoice2: any = filtered[Math.floor((Math.random() * filtered.length))]
    var body = {
      questionSingle: randomSingle,
      choices: [randomChoice1, randomChoice2]
    }
    return body
  }
}
