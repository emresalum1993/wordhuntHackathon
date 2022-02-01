import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss']
})
export class ScoreBoardComponent implements OnInit {
  filterText = ""
  loadingScores = true
  scoreList: any
  activeTab = 0
  myRank: any
  myWordCount: any
  myScore: any
  constructor(public userService: UserServiceService) { }
  ngOnInit(): void {
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
    if (this.activeTab == 0) {
      this.scoreList.sort((a: any, b: any) => parseFloat(b.userId.score) - parseFloat(a.userId.score));
    }
    else {
      this.scoreList.sort((a: any, b: any) => parseFloat(b.words.length) - parseFloat(a.words.length));
    }

    this.getYourRank()
  }
  getYourRank() {
    this.myRank = this.scoreList.findIndex((el: any) => el.userId._id == this.userService.userId)
    this.myScore = this.scoreList[this.myRank].userId.score
    this.myWordCount = this.scoreList[this.myRank].words.length
  }
  indexChange() {
    this.sortScores()
  }
  containsFilter(item: any) {
    if (item.userId.name.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0 || item.userId.score.toString().indexOf(this.filterText.toLocaleLowerCase()) >= 0  || item.words.length.toString().indexOf(this.filterText.toLocaleLowerCase()) >= 0) {
      return true
    }
    else {
      return false
    }
  }

  containsFiltersNone() {
    return this.scoreList.some((item: any) => item.userId.name.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0 || item.userId.score.toString().indexOf(this.filterText.toLocaleLowerCase()) >= 0  || item.words.length.toString().indexOf(this.filterText.toLocaleLowerCase()) >= 0)
  }
}
