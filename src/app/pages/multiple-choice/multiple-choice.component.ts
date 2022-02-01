import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { WordServiceService } from 'src/app/services/word-service.service';
import { environment } from 'src/environments/environment';
import { trigger, transition, useAnimation } from '@angular/animations';
import { tada, fadeIn } from 'ngx-animate';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {params: { timing: 5, delay: 2 }}))]),
    trigger('tada', [transition(':enter', useAnimation(tada, { params: { timing: 2, a: '-100px', b: '0px', c: '-0px', d: '0px', } }))]),
    trigger('wobble', [transition(':enter', useAnimation(tada, { params: { timing: 1, a: '-10px', b: '10px', c: '-0px', d: '0px', } }))]),
  ],
})
export class MultipleChoiceComponent implements OnInit {

  @ViewChild("letterCharInput", { static: false }) codeInput: any;
  emptyPool = false 
  loadingPool = true
  pools:any 
  randomSingle: any
  randoms: any
  selectedWord = ""
  guessedWord = ""
  wordImg = ""
  loadingWordImg = true
  answered = false
  shuffledChoices: any
  constructor(private userService: UserServiceService, private wordService: WordServiceService, private changeDetector: ChangeDetectorRef, private renderer: Renderer2) {
    this.wordService.loadingPools$.subscribe(
      (data) => {
        this.loadingPool = data
      }
    )
    this.wordService.pools$.subscribe(
      (data) => {
        this.pools = data
        if (this.pools.words.length > 0){
          this.emptyPool = false 
          this.getRandomWord()
        }
        else{
          this.emptyPool = true 
        }
        
      }
    )
  }

  ngOnInit(): void {
    this.wordService.loadPool()
    this.loadingWordImg = true
  }
  validateLetters() { }
  ngAfterViewInit(): void { }
  getRandomWord() {
    this.loadingPool = true
    this.loadingWordImg = true
    this.randoms = this.wordService.getRandomChoicesFromPool("tr")
    this.randomSingle = this.randoms.questionSingle
    this.randomSingle.scoreToGrant = this.randomSingle.translated.length * environment.guessScore.letter
    let arrChoices = [this.randoms.questionSingle.translated, this.randoms.choices[0].translated, this.randoms.choices[1].translated]
    this.shuffledChoices = arrChoices
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    this.wordService.imgSearch(this.randomSingle.translated).subscribe(
      (data) => {
        if (JSON.parse(data.result).value.length > 0) {
          this.wordImg = JSON.parse(data.result).value[0].thumbnailUrl
        }
        else {
          this.wordImg = "http://www.ballonssansfrontiere.com/wp-content/plugins/download-manager/assets/images/img-404.png"
        }
        this.loadingWordImg = false
        this.changeDetector.detectChanges();
        this.loadingPool = false
        this.answered = false
        this.selectedWord = ""
      }
    )
  }
  getChoiceText(x: number) {
    return this.shuffledChoices[x]
  }
  chooseChoice(x: number) {
    this.selectedWord = this.shuffledChoices[x]
    if (this.selectedWord.toLowerCase() == this.randomSingle.translated.toLowerCase()) {
      this.randomSingle.scoreToGrant = this.randomSingle.translated.length * environment.guessScore.letter
      this.userService.updateScore(this.randomSingle.scoreToGrant)
    }
    else {
      this.randomSingle.scoreToGrant = 0
    }
    this.answered = true
  }

  checkCorrect() {
    if (this.answered) {
      if (this.selectedWord.toLowerCase() == this.randomSingle.translated.toLowerCase()) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }
}
