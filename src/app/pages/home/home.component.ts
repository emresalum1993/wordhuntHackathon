import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn, fadeInLeft, fadeInRight,rubberBand } from 'ngx-animate';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('bounce', [transition('* => *', useAnimation(fadeInLeft, { params: { timing: .5,  a: '-100px', b: '0px', c: '-0px', d: '0px', } })),transition('* => *', useAnimation(fadeInRight))]),
    trigger('rubber', [transition('* => *', useAnimation(rubberBand, {
      params: { timing: 1, delay: .2 }
    }))]),
    trigger('fade', [transition('* => *', useAnimation(fadeIn, {
      params: { timing: 1, delay: .2 }
    }))])
  ]
})
export class HomeComponent implements OnInit {
  showGameModes = false;
  showAvatar = false
  constructor() { }
  ngOnInit(): void {
    this.showAvatar = true 
  }

}
