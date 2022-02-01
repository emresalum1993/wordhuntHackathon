import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserServiceService } from 'src/app/services/user-service.service';
import { WordServiceService } from 'src/app/services/word-service.service';

@Component({
  selector: 'app-learn-word',
  templateUrl: './learn-word.component.html',
  styleUrls: ['./learn-word.component.scss'],
  providers: [MessageService]
})
export class LearnWordComponent implements OnInit {
  loadingPool = true
  loadingTranslate = false
  loadingHistory = true
  savingNewWord = false
  savedRecent = false
  filterText = ""
  translateResult: any
  poolsItems: any
  historyItems: any

  constructor(private wordService: WordServiceService, private userService: UserServiceService, private messageService: MessageService) {
    this.wordService.loadingPools$.subscribe(
      (data) => {
        this.loadingPool = data
      }
    )
    this.wordService.pools$.subscribe(
      (data) => {
        this.poolsItems = data
        this.generatePoolItemsonHistory()
      }
    )
    this.wordService.loadingHistory$.subscribe(
      (data) => {
        this.loadingHistory = data
      }
    )
    this.wordService.history$.subscribe(
      (data) => {
        this.historyItems = data
        this.generatePoolItemsonHistory()
      }
    )
  }
  translateMode = "tr:en"
  translateOptions: any
  translateText: string = ""
  ngOnInit(): void {
    this.wordService.loadPool()
    this.wordService.loadHistory();
    this.translateOptions = [
      { name: 'Türkçe > İngilizce', code: 'tr:en' },
      { name: 'İngilizce > Türkçe', code: 'en:tr' },
    ];
    this.translateMode = "tr:en"
  }
  translate() {
    if (this.translateText.length > 0) {
      this.savedRecent = false
      this.loadingTranslate = true
      var fromTo = this.translateMode.split(":")
      this.wordService.translate(this.translateText, fromTo[0], fromTo[1]).subscribe(
        (data) => {
          this.loadingTranslate = false
          this.translateResult = JSON.parse(data.result)

          let originalText = this.translateText
          let translatedText = this.translateResult[0].translations[0].text
          let newSourceLang = fromTo[0]
          let newDestLang = fromTo[1]
         
          if (fromTo[0] == "en") {
            originalText = this.translateResult[0].translations[0].text
            translatedText = this.translateText
            newSourceLang = fromTo[1]
            newDestLang = fromTo[0]
          }


          var body = {
            sourceLang: newSourceLang,
            destLang: newDestLang,
            original: originalText,
            translated: translatedText,
            date: new Date(),
            score: 10,
            userId: this.userService.userId
          }
          this.savingNewWord = true
          this.wordService.saveToHistory(body).subscribe(
            (data) => {
              this.savingNewWord = false
              this.wordService.loadHistory();
              this.userService.refreshUser()
            }
          )
        }
      )
    }
  }

  saveWordToPool() {
    this.savedRecent = false
    var fromTo = this.translateMode.split(":")
    let originalText = this.translateText
    let translatedText = this.translateResult[0].translations[0].text
    let newSourceLang = fromTo[0]
    let newDestLang = fromTo[1]
   
    if (fromTo[0] == "en") {
      originalText = this.translateResult[0].translations[0].text
      translatedText = this.translateText
      newSourceLang = fromTo[1]
      newDestLang = fromTo[0]
    }
    var body = {
      sourceLang: newSourceLang,
      destLang: newDestLang,
      original: originalText,
      translated: translatedText,
      date: new Date(),
      score: 10,
      userId: this.userService.userId
    }
    this.savingNewWord = true
    this.wordService.saveToPool(body).subscribe(
      (data) => {
        this.savingNewWord = false
        this.wordService.loadPool()
        this.userService.refreshUser()
        this.savedRecent = true
      }
    )
  }
  saveWordToPoolByWord(item: any, original: string, translated: string, sourceLang: string, destLang: string) {
    let originalText = original
    let translatedText = translated
    let newSourceLang = sourceLang
    let newDestLang = destLang
    if (sourceLang == "en") {
      originalText = translated
      translatedText = original
      newSourceLang = destLang
      newDestLang = sourceLang
    }
    var body = {
      sourceLang: newSourceLang,
      destLang: newDestLang,
      original: originalText,
      translated: translatedText,
      date: new Date(),
      score: 10,
      userId: this.userService.userId
    }

    console.log(body)
    item.saving = true
    this.wordService.saveToPool(body).subscribe(
      (data) => {
        this.wordService.loadPool()
        item.saving = false
        this.userService.refreshUser()
      }
    )
  }

  disabledTranslate() {
    return this.translateText.length > 0 ? false : true
  }
  containsFiltersNone() {
    return this.historyItems.words.some((item: any) => item.original.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0 || item.translated.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0)
  }
  containsFilter(item: any) {
    if (item.original.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0 || item.translated.toLowerCase().indexOf(this.filterText.toLocaleLowerCase()) >= 0) {
      return true
    }
    else {
      return false
    }
  }
  copyToClipBoard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.messageService.add({ key: 'bc', severity: 'info', detail: 'Kelime panoya kopyalandı.' });
  }
  generatePoolItemsonHistory() {
    if (this.poolsItems && this.poolsItems.words.length > 0 && this.historyItems && this.historyItems.words.length > 0) {
      this.poolsItems.words.forEach((element: any) => {
        let arr = this.historyItems.words.filter((word: any) => word.sourceLang == element.sourceLang && word.destLang == element.destLang && word.original == element.original && word.translated == element.translated)
        arr.forEach((a: any) => {
          a.inPool = true
        });

      });
    }

    console.log(this.poolsItems)

  }

  completeDelete(item: any) {
    item.loadingDelete = true
    item.inPool = false
    this.wordService.deleteFromPool(item._id).subscribe(
      (data) => {
        item.loadingDelete = false
        var newPools = {
          _id: this.poolsItems._id,
          userId: this.poolsItems.userId,
          words: this.poolsItems.words.filter((f: any) => f._id !== item._id)
        }
        this.wordService.pools$.next(newPools)
      }
    )
  }
}



