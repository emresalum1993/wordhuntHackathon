import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
//Add Turkish locale
import 'moment/src/locale/tr';
moment.locale('tr')

@Component({
  selector: 'app-score-single',
  templateUrl: './score-single.component.html',
  styleUrls: ['./score-single.component.scss']
})
export class ScoreSingleComponent implements OnInit {

  //Inputs for component
  //single score board item
  @Input() item:any
  //scoreboard type. (score or word)
  @Input() type:any
  //rank index of high score.
  @Input() rank:any


  constructor() { }

  ngOnInit(): void {
  }

  //Convert time to use friendly time string with momentjs
  getDateFriendly(date:any){
   return moment(date).fromNow()
  }

}
