import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { SidebarsService } from './sidebar.service'
import { SecureService } from "./../../secure/secure.service";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public ismenuOpen: boolean = false;
  public isPopupOpen: boolean = false;
  public storeName: String;

  constructor(private sidebarsService: SidebarsService, private secureService:SecureService, private eRef: ElementRef) { }

  public state = false;
  public user:any;

  toggle() {
    this.state = !this.state;
  }

  ngOnInit() {
    this.getUser()
  }
  
  menuOpen() {
    this.ismenuOpen = !this.ismenuOpen;
  }

  openPopup(status) {
    this.isPopupOpen = status;
  }

  changeMenu(state) {
    this.isPopupOpen = state;
  }

  getUser() {
    this.user = this.secureService.getUser();
    this.storeName = this.user.storeName;
    
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('shopUrl');
  }
}
