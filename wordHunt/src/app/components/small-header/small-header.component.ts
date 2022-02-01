import { Component, OnInit } from '@angular/core';
 
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-small-header',
  templateUrl: './small-header.component.html',
  styleUrls: ['./small-header.component.scss'],
  providers : [MessageService]
})
export class SmallHeaderComponent implements OnInit {


  //Show detailed user menu for score-level-logout. Two way binding.  
  displayMenu = false

constructor(private messageService: MessageService) { }
  ngOnInit(): void { }

}
