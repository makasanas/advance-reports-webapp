import { Routes } from "@angular/router";
import { PricingComponent } from "./pricing/pricing.component";
import { SettingsComponent } from "./settings/settings.component";
import { ActivePlanComponent } from "./active-plan/active-plan.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FaqsComponent } from "./faqs/faqs.component";
import { ReportsComponent } from "./reports/reports.component";
import { SalesReportComponent } from "./salesReport/salesReport.component";

export const SECURE_ROUTES: Routes = [
  {
    path: "pricing",
    component: PricingComponent
  },
  {
    path: "settings",
    component: SettingsComponent
  },
  {
    path: "activeplan",
    component: ActivePlanComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "faq",
    component: FaqsComponent
  },
  {
    path: "reports",
    component: ReportsComponent
  },
  {
    path: "reportsDetail",
    component: SalesReportComponent
  }
];
