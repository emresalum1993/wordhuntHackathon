import { trigger, transition, useAnimation } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { fadeInLeft, fadeInRight, tada, wobble } from 'ngx-animate';
import { UserServiceService } from 'src/app/services/user-service.service';
import { WordServiceService } from 'src/app/services/word-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-guess-word',
  templateUrl: './guess-word.component.html',
  styleUrls: ['./guess-word.component.scss'],
  animations: [
    trigger('tada', [transition(':enter', useAnimation(tada, { params: { timing: 2, a: '-100px', b: '0px', c: '-0px', d: '0px', } }))]),
    trigger('wobble', [transition(':enter', useAnimation(tada, { params: { timing: 1, a: '-10px', b: '10px', c: '-0px', d: '0px', } }))]),
  ]
})
export class GuessWordComponent implements OnInit, AfterViewInit {


  //Get DOM element letterCharInput
  @ViewChild("letterCharInput", { static: false }) codeInput: any;
  //Pool variables
  loadingPool = true
  pools = []
  //Image variables 
  wordImg = ""
  loadingWordImg = true
  //Guess & answer
  randomSingle: any
  answerLetter: any = []
  guessedWord = ""
  constructor(private wordService: WordServiceService, private changeDetector: ChangeDetectorRef, private renderer: Renderer2, private userService: UserServiceService) {
    this.wordService.loadingPools$.subscribe(
      (data) => {
        this.loadingPool = data
      }
    )
    this.wordService.pools$.subscribe(
      (data) => {
        this.pools = data
        console.log(this.pools)

        this.getRandomWord()
      }
    )
  }
  ngOnInit(): void {

    //Call wordService function to fetch used pool from database.
    this.wordService.loadPool()
    this.loadingWordImg = true
  }
  onCodeChanged(x: any) {
    //On single letter box change.
    //Nothing to do.
  }
  onCodeCompleted(event: any) {
    //On fill all letter boxes.
    //Check if word guessed right.
    event.split("").forEach((l: any, index: number) => {
      this.answerLetter[index].char = l.toLowerCase()
      if (l == this.randomSingle.translated.split("")[index].toLowerCase()) {
        this.answerLetter[index].type = 1
      }
      else {
        if (l.length == 0) {
          this.answerLetter[index].type = 0
        }
        else {
          this.answerLetter[index].type = -1
        }
      }
    })

    //Add classes to letter boxed depends on their status. (To paint right-wrong guesses)
    this.codeInput.inputsList._results.forEach((i: any, index: number) => {
      this.renderer.removeClass(i.nativeElement, 'success')
      this.renderer.removeClass(i.nativeElement, 'fail')
      this.renderer.removeClass(i.nativeElement, 'empty')
      this.renderer.addClass(i.nativeElement, this.answerLetter[index].type == 1 ? 'success' : (this.answerLetter[index].type == -1 ? 'fail' : 'empty'));
    })

    //Recalculate score will user gain 
    if (this.answerLetter.every((e: any) => e.type == 1)) {
      this.userService.updateScore(this.randomSingle.scoreToGrant)
    }
    else {
      this.randomSingle.scoreToGrant += environment.guessScore.complete
    }
  }

  validateLetters() { }
  ngAfterViewInit(): void { }
  getTipLetter() {
    //Give single letter as tip
    let filtered = this.answerLetter.filter((f: any) => f.type !== 1)
    var randomChar = filtered[Math.floor((Math.random() * filtered.length))]
    var index = randomChar.index
    this.answerLetter[index].char = this.randomSingle.translated.split("")[index].toLowerCase()
    this.answerLetter[index].type = 1
    this.codeInput.inputsList._results.forEach((i: any, index: number) => {
      this.renderer.removeClass(i.nativeElement, 'success')
      this.renderer.removeClass(i.nativeElement, 'fail')
      this.renderer.removeClass(i.nativeElement, 'empty')

      this.renderer.setValue(i.nativeElement, this.answerLetter[index])
      this.renderer.addClass(i.nativeElement, this.answerLetter[index].type == 1 ? 'success' : (this.answerLetter[index].type == -1 ? 'fail' : 'empty'));
    })
    this.codeInput.inputsList._results[index].nativeElement.value = this.answerLetter[index].char.toLowerCase()
    this.randomSingle.scoreToGrant -= environment.guessScore.letter
  }

  //Show word, skip guess part. No points will be granted.
  showWord() {
    let filtered = this.answerLetter.filter((f: any) => f.type !== 1)
    filtered.forEach((o: any, index: number) => {
      this.answerLetter[index].char = this.randomSingle.translated.split("")[index].toLowerCase()
      this.answerLetter[index].type = 1
      this.codeInput.inputsList._results.forEach((i: any, index: number) => {
        this.renderer.removeClass(i.nativeElement, 'success')
        this.renderer.removeClass(i.nativeElement, 'fail')
        this.renderer.removeClass(i.nativeElement, 'empty')

        this.renderer.setValue(i.nativeElement, this.answerLetter[index])
        this.renderer.addClass(i.nativeElement, this.answerLetter[index].type == 1 ? 'success' : (this.answerLetter[index].type == -1 ? 'fail' : 'empty'));
      })
      this.codeInput.inputsList._results[index].nativeElement.value = this.answerLetter[index].char.toLowerCase()
      console.log(this.answerLetter)
      this.randomSingle.scoreToGrant = 0
    })
  }

  //Check if all boxes - letters are right.
  checkAllCorrect() {
    if (this.answerLetter.every((e: any) => e.type == 1)) {
      return true
    }
    else {
      return false
    }
  }

  //Get random word from Pool
  getRandomWord() {
    this.loadingPool = true
    this.loadingWordImg = true
    this.randomSingle = this.wordService.getRandomFromPool("tr")
    this.answerLetter = []
    this.randomSingle.scoreToGrant = this.randomSingle.translated.length * environment.guessScore.letter
    this.randomSingle.translated.split("").forEach((f: string, index: number) => {
      this.answerLetter.push({ type: 0, char: "", index: index })
    })
    //Perform Bing Image searh to get image of word.
    this.wordService.imgSearch(this.randomSingle.translated).subscribe(
      (data) => {
        console.log(JSON.parse(data.result))
        if (JSON.parse(data.result).value.length > 0) {
          this.wordImg = JSON.parse(data.result).value[0].thumbnailUrl
        }
        else {
          this.wordImg = "http://www.ballonssansfrontiere.com/wp-content/plugins/download-manager/assets/images/img-404.png"
        }
        this.loadingWordImg = false
        console.log(this.randomSingle)
        this.changeDetector.detectChanges();
        console.log(this.codeInput)
        this.loadingPool = false
      }
    )
  }
}


