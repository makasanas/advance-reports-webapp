import { Component, OnInit } from "@angular/core";
import { PricingService } from "./pricing.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SecureService } from "./../secure.service";

@Component({
  selector: "app-pricing",
  templateUrl: "./pricing.component.html",
  styleUrls: ["./pricing.component.scss"]
})
export class PricingComponent implements OnInit {
  public planData: any = {
    planName: ""
  };
  public planPrice: number;
  public loading: boolean = false;
  public recurring_application_charge: any = {};
  public recurringCharge: any = {
    recurring_application_charge: {}
  };
  public user: any;
  public trial: any = {
    days: 14,
    nextMonthStartDate: new Date()
  };
  public freeTrialDays: number = 14;
  public pricingPlans: any = {
    plans: [
      {
        name: "Premium",
        price: 4.99,
        features: [
          "Multiple rules creation",
          "Conditional tagging",
          "Auto tagging",
          "Advanced order filtering"
        ]
      }
    ],
    activePlan: "",
    activePlanIndex: 0
  };
  constructor(
    private pricingService: PricingService,
    private secureService: SecureService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.secureService.getUser();
    // this.checkPlan();
  }

  checkTrial() {
    let dt2 = new Date();
    let dt1 = new Date(this.trial["start"]);
    let tmpDays =
      this.trial["days"] -
      Math.floor(
        (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
          Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
          (1000 * 60 * 60 * 24)
      );
    this.trial["days"] = tmpDays > 0 ? tmpDays : 0;
  }

  checkPlan() {
    this.loading = true;

    if (this.user) {
      if (Object.keys(this.user).indexOf("trial_days") == -1) {
        this.trial["days"] = this.freeTrialDays;
      } else {
        if (this.user.trial_days != null) {
          this.trial["days"] = this.user.trial_days;
        } else {
          this.trial["days"] = this.freeTrialDays;
        }
      }
    }

    this.trial["start"] = !this.user.trial_start
      ? new Date()
      : this.user.trial_start;
    this.checkTrial();
    if (
      !this.user.recurringPlanType ||
      this.user.recurringPlanType === "Free"
    ) {
      let count = this.user.productCount;

      let plan: any = {
        name: "Premium",
        price: "4.99"
      };

      this.acceptPlan(plan.name, plan.price);
      this.pricingPlans.activePlan = plan.name;
    } else {
      this.getPlan();
    }
  }

  getPlan() {
    this.loading = true;
    this.pricingService.getPlan().subscribe(
      res => {
        this.loading = false;
        this.planData = res.data;
        this.pricingPlans.activePlan = res.data.planName;
        this.pricingPlans.activePlanIndex = this.pricingPlans.plans.findIndex(
          p => p.name == this.pricingPlans.activePlan
        );
      },
      err => {}
    );
  }

  acceptPlan(planName, planPrice) {
    this.recurringCharge.recurring_application_charge.name = planName;
    this.recurringCharge.recurring_application_charge.price = planPrice;
    this.recurringCharge.recurring_application_charge.trial_days = this.trial[
      "days"
    ];
    this.recurringCharge.recurring_application_charge.return_url =
      window.location.origin + "/app/activeplan";
    if (
      localStorage.getItem("shopUrl") == "dev-srore.myshopify.com" ||
      localStorage.getItem("shopUrl") == "webrex-test-store.myshopify.com"
    ) {
      this.recurringCharge.recurring_application_charge.test = true;
    } else {
      this.recurringCharge.recurring_application_charge.test = false;
    }
    this.pricingService.acceptPlan(this.recurringCharge).subscribe(
      res => {
        var installUrl = res.data.recurring_application_charge.confirmation_url;
        document.location.href = installUrl;
      },
      err => {
        console.log(err);
      }
    );
  }

  activeBasicPlan() {
    this.pricingService.basePlane().subscribe(
      res => {
        // console.log(res)
        this.getPlan();
      },
      err => {
        console.log(err);
      }
    );
  }
}
