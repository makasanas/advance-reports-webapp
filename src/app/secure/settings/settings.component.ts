import { Component, OnInit } from "@angular/core";
import { SettingsService } from "./settings.service";
import { SecureService } from "../secure.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  public planName: String;
  public planId: number;
  public startDate: String;
  public endDate: String;
  // public storeName: String;
  // public emailID: String;
  // public phone: String;
  public storeData: any = {
    storeName: "",
    shopUrl: "",
    email: "",
    phone: "",
    currency: "",
    country_name: "",
    recurringPlanName: ""
  };
  public syncData: any = {
    productSync: null,
    orderSync: null
  };
  public loading = false;
  public planError: boolean = false;
  public tabs = {
    list: [
      {
        tab: "details",
        label: "Store Details"
      },
      {
        tab: "sync",
        label: "Sync"
      }
    ],
    activeTab: "details"
  };
  public syncProcess: any = {
    products: false,
    orders: false
  };
  public appForm: FormGroup;
  public activeTab: string;

  constructor(
    private settingsService: SettingsService,
    private secureService: SecureService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.appForm = this.fb.group({
      appEnabled: new FormControl("false")
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.tabs.activeTab = params["activeTab"]
        ? params["activeTab"]
        : "details";
    });
    this.getPlan();
    this.getUser();
    this.getSyncData();
    this.getAppStatus();
    this.syncOrders();
  }

  getPlan() {
    this.settingsService.getPlan().subscribe(
      res => {
        this.planName = res.data.planName;
        this.planId = res.data._id;
        this.startDate = res.data.started;
        this.endDate = res.data.nextBillDate;
      },
      err => {}
    );
  }

  getUser() {
    this.settingsService.getUser().subscribe(
      res => {
        this.storeData = res.data;
      },
      err => {}
    );
  }

  getSyncData() {
    this.settingsService.getSyncData().subscribe(
      res => {
        this.syncData = res.data;
      },
      err => {
        console.log(err);
      }
    );
  }

  deactivePlan() {
    this.settingsService.deactivePlan(this.planId).subscribe(
      res => {
        this.getPlan();
      },
      err => {
        // console.log(err);
      }
    );
  }

  // syncProducts() {
  //   this.loading = true;
  //   this.settingsService.syncProducts().subscribe((res) => {
  //     console.log(res.message);
  //     if (res.message == 'OK') {
  //       this.loading = false;
  //     }
  //     // this.getPlan()
  //   }, err => {
  //     // console.log(err);
  //     this.changeBoolean('planError', true);
  //   });
  // }

  changeTab(tab) {
    this.tabs.activeTab = tab;
  }

  changeBoolean(variable: string, value: boolean) {
    this[variable] = value;
  }

  sync(type: string) {
    this.syncProcess[type] = true;
    this.secureService.sync(type).subscribe(
      res => {
        this.syncProcess[type] = false;
        this.getSyncData();
      },
      err => {
        this.syncProcess[type] = false;
        console.log(err);
        if (err.status == 402) {
          this.changeBoolean("planError", true);
        }
      }
    );
  }

  syncOrders() {
    this.syncProcess["orders"] = true;
    this.settingsService.syncOrders().subscribe(
      res => {
        this.syncProcess["orders"] = false;
        this.syncData.orderSync = res.data.orderSync;
      },
      err => {
        this.syncProcess["orders"] = false;
        console.log(err);
        if (err.status == 402) {
          this.changeBoolean("planError", true);
        }
      }
    );
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
          console.log(err);
        }
      );
  }

  getAppStatus() {
    let user = this.secureService.getUser();
    // this.enableForm = user.appEnabled;
    this.secureService.fetchUser().subscribe(
      res => {
        this.appForm.controls.appEnabled.setValue(res["data"]["appEnabled"]);
      },
      err => {
        console.log(err);
      }
    );
  }
}
