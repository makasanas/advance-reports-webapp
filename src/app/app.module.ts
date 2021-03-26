import { BrowserModule } from "@angular/platform-browser";

import { NgModule, ErrorHandler } from "@angular/core";

import { FormsModule } from "@angular/forms";

import { ReactiveFormsModule } from "@angular/forms";

import { HttpModule } from "@angular/http";

import { AppRoutingModule } from "./app-routing.module";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";

import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from "angularx-social-login";
import * as Sentry from "@sentry/browser";

import { SentryService } from "./services/sentry.service";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";

//services
import { AuthService } from "./public/auth/auth.service";

import { BothAuthGuard } from "./services/both-auth-guard.service";

import { DashboradService } from "./secure/dashboard/dashborad.service";

import { PricingService } from "./secure/pricing/pricing.service";

import { AuthGuard } from "./services/auth-guard.service";

import { AntiAuthGuardService } from "./services/anti-auth-guard.service";

import { ActivePlanService } from "./secure/active-plan/active-plan.service";

import { SettingsService } from "./secure/settings/settings.service";

import { SecureService } from "./secure/secure.service";

import { FaqsService } from "./secure/faqs/faqs.service";

import * as pluginDataLabels from "chartjs-plugin-datalabels";

//component
import { AppComponent } from "./app.component";

import { InstallComponent } from "./public/install/install.component";

import { AuthComponent } from "./public/auth/auth.component";

import { DashboardComponent } from "./secure/dashboard/dashboard.component";

import { SidebarComponent } from "./common/sidebar/sidebar.component";

import { PricingComponent } from "./secure/pricing/pricing.component";

import { SettingsComponent } from "./secure/settings/settings.component";

import { LoadingComponent } from "./common/loading/loading.component";

import { ActivePlanComponent } from "./secure/active-plan/active-plan.component";

import { ChartsModule } from "ng2-charts";

import { PublicComponent } from "./public/public.component";

import { SecureComponent } from "./secure/secure.component";

import { FaqsComponent } from "./secure/faqs/faqs.component";

import { HeaderComponent } from "./common/header/header.component";

import { NoDataComponent } from "./common/no-data/no-data.component";

import { NiceDateFormatPipe } from "./common/niceDateFormatPipe";

import { TagListComponent } from "./secure/tag-list/tag-list.component";

import { ReportsComponent } from "./secure/reports/reports.component";

import { SalesReportComponent } from "./secure/salesReport/salesReport.component";

import { HttpClientModule } from "@angular/common/http";

import { environment } from "./../environments/environment";

import { getAttrsForDirectiveMatching } from "@angular/compiler/src/render3/view/util";

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      "825133742036-5aj1qk5sdfni90g5175pma62kssgb52e.apps.googleusercontent.com"
    )
  }
]);

if (environment.production) {
  Sentry.init({
    dsn:
      "https://1d5a04b46e4c4bd9bdf805d797be08ee@o401113.ingest.sentry.io/5394901",
    // TryCatch has to be configured to disable XMLHttpRequest wrapping, as we are going to handle
    // http module exceptions manually in Angular's ErrorHandler and we don't want it to capture the same error twice.
    // Please note that TryCatch configuration requires at least @sentry/browser v5.16.0.
    integrations: [
      new Sentry.Integrations.TryCatch({
        XMLHttpRequest: false
      })
    ]
  });
}

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    InstallComponent,
    AuthComponent,
    DashboardComponent,
    SidebarComponent,
    PricingComponent,
    SettingsComponent,
    LoadingComponent,
    ActivePlanComponent,
    PublicComponent,
    SecureComponent,
    FaqsComponent,
    HeaderComponent,
    NoDataComponent,
    NiceDateFormatPipe,
    TagListComponent,
    ReportsComponent,
    SalesReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ChartsModule,
    NgxDatatableModule,
    NgbModule,
    // NgbDate,
    // NgbCalendar,
    SocialLoginModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    DashboradService,
    AuthGuard,
    AntiAuthGuardService,
    PricingService,
    ActivePlanService,
    SettingsService,
    SecureService,
    FaqsService,
    BothAuthGuard,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },

    {
      provide: ErrorHandler,
      useClass: SentryService
    }
  ],
  exports: [SalesReportComponent],
  bootstrap: [AppComponent, SalesReportComponent]
})
export class AppModule {}
