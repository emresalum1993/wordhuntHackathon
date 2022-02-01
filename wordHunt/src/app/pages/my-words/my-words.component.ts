import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeInDown, fadeInUp, slideInDown } from 'ngx-animate';
import { UserServiceService } from 'src/app/services/user-service.service';
import { WordServiceService } from 'src/app/services/word-service.service';

@Component({
  selector: 'app-my-words',
  templateUrl: './my-words.component.html',
  styleUrls: ['./my-words.component.scss'],
  animations: [
    trigger('tada', [transition(':enter', useAnimation(slideInDown, { params: { timing: .3 } }))]),

  ]
})
export class MyWordsComponent implements OnInit {
  loadingScores = true
  scoreList: any
myRank:any
  loadingPool = true
  loadingAggregated = true
  pools: any
  filterText: string = ""
  displayDetails = false
  loadingDelete = false
  selectedSingle: any
  constructor(private wordService: WordServiceService,private userService:UserServiceService) {
    this.wordService.loadingPools$.subscribe(
      (data) => {
        this.loadingPool = data
      }
    )
    this.wordService.pools$.subscribe(
      (data) => {
        this.pools = data

      }
    )

  }

  ngOnInit(): void {
    this.wordService.loadPool();    
    this.getScores()

  }
  getScores() {
    this.loadingScores = true
    this.userService.getRankWord().subscribe((data) => {
      this.loadingScores = false
      this.scoreList = data.result
      this.sortScores()
    })
  }
  sortScores() {
  
      this.scoreList.sort((a: any, b: any) => parseFloat(b.words.length) - parseFloat(a.words.length));
      this.getYourRank()
  }
  getYourRank() {
    this.myRank = this.scoreList.findIndex((el: any) => el.userId._id == this.userService.userId)
  }
  selectedItem(event: any) {
    this.displayDetails = true
    this.selectedSingle = event
  }
  containsFilter(item: any) {
    if (item.original.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0 || item.translated.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0) {
      return true
    }
    else {
      return false
    }
  }

  containsFiltersNone() {
    return this.pools.words.some((item: any) => item.original.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0 || item.translated.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0)
  }
  completeDelete() {
    this.selectedSingle.deleting = true
    this.loadingDelete = true
    this.wordService.deleteFromPool(this.selectedSingle._id).subscribe(
      (data) => {
        this.loadingDelete = false
        this.displayDetails = false
        var newPools = {
          _id: this.pools._id,
          userId: this.pools.userId,
          words: this.pools.words.filter((f: any) => f._id !== this.selectedSingle._id)
        }
        this.wordService.pools$.next(newPools)
      }
    )
  }
}
