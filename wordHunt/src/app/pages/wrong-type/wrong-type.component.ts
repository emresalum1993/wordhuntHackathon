
import { trigger, transition, useAnimation } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { tada } from 'ngx-animate';
import { UserServiceService } from 'src/app/services/user-service.service';
import { WordServiceService } from 'src/app/services/word-service.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-wrong-type',
  templateUrl: './wrong-type.component.html',
  styleUrls: ['./wrong-type.component.scss'],
  animations: [
    trigger('tada', [transition(':enter', useAnimation(tada, { params: { timing: 2, a: '-100px', b: '0px', c: '-0px', d: '0px', } }))]),
    trigger('wobble', [transition(':enter', useAnimation(tada, { params: { timing: 1, a: '-10px', b: '10px', c: '-0px', d: '0px', } }))]),
  ]
})
export class WrongTypeComponent implements OnInit, AfterViewInit {

  @ViewChild("letterCharInput", { static: false }) codeInput: any;
  loadingPool = true
  pools = []
  randomSingle: any
  answerLetter: any = []
  missType = ""
  guessedWord = ""
  wordImg = ""
  loadingWordImg = true
  constructor(private wordService: WordServiceService, private changeDetector: ChangeDetectorRef, private renderer: Renderer2, private userService: UserServiceService) {
    this.wordService.loadingPools$.subscribe(
      (data) => {
        this.loadingPool = data
      }
    )
    this.wordService.pools$.subscribe(
      (data) => {
        this.pools = data
        this.getRandomWord()
      }
    )
  }

  ngOnInit(): void {
    this.wordService.loadPool()
    this.loadingWordImg = true
  }
  getMissType() {
    let arrChars = this.randomSingle.translated.split("")
    let randomChar = Math.floor((Math.random() * arrChars.length))
    if (randomChar == 0) {
      var l1 = arrChars[randomChar]
      var l2 = arrChars[randomChar + 1]
      arrChars[randomChar + 1] = l1
      arrChars[randomChar] = l2
    }
    else if (randomChar == arrChars.length) {
      var l1 = arrChars[randomChar]
      var l2 = arrChars[randomChar - 1]
      arrChars[randomChar - 1] = l1
      arrChars[randomChar] = l2
    }
    else {
      var l1 = arrChars[randomChar]
      var l2 = arrChars[randomChar - 1]
      arrChars[randomChar - 1] = l1
      arrChars[randomChar] = l2
    }
    return arrChars.join("")
  }
  onCodeChanged(x: any) { }
  onCodeCompleted(event: any) {
    event.split("").forEach((l: any, index: number) => {
      this.answerLetter[index].char = l.toLowerCase()
      if (l.toLowerCase() == this.randomSingle.translated.split("")[index].toLowerCase()) {
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
    this.codeInput.inputsList._results.forEach((i: any, index: number) => {
      this.renderer.removeClass(i.nativeElement, 'success')
      this.renderer.removeClass(i.nativeElement, 'fail')
      this.renderer.removeClass(i.nativeElement, 'empty')
      this.renderer.addClass(i.nativeElement, this.answerLetter[index].type == 1 ? 'success' : (this.answerLetter[index].type == -1 ? 'fail' : 'empty'));
    })
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
      this.randomSingle.scoreToGrant = 0
    })
  }
  checkAllCorrect() {
    if (this.answerLetter.every((e: any) => e.type == 1)) {
      return true
    }
    else {
      return false
    }
  }
  getRandomWord() {
    this.loadingPool = true
    this.loadingWordImg = true
    this.randomSingle = this.wordService.getRandomFromPool("tr")
    this.answerLetter = []
    this.randomSingle.scoreToGrant = this.randomSingle.translated.length * environment.guessScore.letter
    this.randomSingle.translated.split("").forEach((f: string, index: number) => {
      this.answerLetter.push({ type: 0, char: "", index: index })
      this.missType = this.getMissType()
    })
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
      }
    )
  }
}
