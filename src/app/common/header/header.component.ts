import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { SecureService } from "../../secure/secure.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  @Output() sidebarBehaviour = new EventEmitter<boolean>();

  public storeName: string = "Dev Store";
  public menu: any = {
    header: false
  };
  public appForm: FormGroup;
  public fullSidebar: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private secureService: SecureService
  ) {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.menu["header"] = false;
      }
    });
    this.appForm = this.fb.group({
      appEnabled: new FormControl("false")
    });
  }

  ngOnInit() {
    this.getAppStatus();
  }

  changeMenu(name) {
    this.menu[name] = !this.menu[name];
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("shopUrl");
  }

  statusChanged(event: any) {
    this.secureService
      .changeAppStatus({
        shopUrl: localStorage.getItem("shopUrl"),
        appEnabled: this.appForm.controls.appEnabled.value
      })
      .subscribe(
        res => {
          this.getAppStatus();
        },
        err => {
          this.getAppStatus();
        }
      );
  }

  getAppStatus() {
    let user = this.secureService.getUser();
    // this.enableForm = user.appEnabled;
    this.secureService.fetchUser().subscribe(
      res => {
        this.storeName = res.data.storeName;
        this.appForm.controls.appEnabled.setValue(res["data"]["appEnabled"]);
      },
      err => {}
    );
  }

  changeSidebar() {
    this.fullSidebar = !this.fullSidebar;
    this.sidebarBehaviour.emit(this.fullSidebar);
  }
}
