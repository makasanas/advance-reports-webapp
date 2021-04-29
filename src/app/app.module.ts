import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ErrorHandler, APP_INITIALIZER } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from "./app-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { Router } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";

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
import { ReportsComponent } from "./secure/reports/reports.component";
import { SalesReportComponent } from "./secure/salesReport/salesReport.component";
import { environment } from "./../environments/environment";

if (environment.production) {
  Sentry.init({
    dsn: environment.SentryToken,
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: [environment.apiUrl],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    tracesSampleRate: 1.0,
  });
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
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => { },
      deps: [Sentry.TraceService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
