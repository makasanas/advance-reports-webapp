import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { SecureService } from "./secure/secure.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public route: string = '';

  constructor(private router: Router, private secureService: SecureService, private location: Location) {}
  
}
