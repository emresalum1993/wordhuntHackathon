import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() iconOnly:boolean = false 
  constructor(public userService: UserServiceService, private router:Router) { }

  ngOnInit(): void {
  }
 
  //Perform logout operation
  logOut(){
    //Remova localstorage object
    localStorage.removeItem("user")
    //Reload window location
    window.location.reload()
  }
}
