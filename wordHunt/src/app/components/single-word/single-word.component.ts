import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-single-word',
  templateUrl: './single-word.component.html',
  styleUrls: ['./single-word.component.scss']
})
export class SingleWordComponent implements OnInit {
  //Input compoenent
  //Single word object.
  @Input() item:any

  //Output to fire when single word selected to delete. 
  @Output() selectedDetails = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  //Transform language code to string 
  getLang(code:string){
    var ret = ""
    code == "tr" ?  ret = "Türkçe" : ret = "İngilizce"
    return ret
  }

  //Emit output to open dialog in parent container.
  selectItem(){
    this.selectedDetails.emit(this.item)
  }
}
