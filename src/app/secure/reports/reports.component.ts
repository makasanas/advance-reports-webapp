import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SecureService } from "./../secure.service";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"]
})
export class ReportsComponent implements OnInit {
  public salesReportsList: any;
  public taxesReportsList: any;
  public geoReportsList: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private secureService: SecureService
  ) {
    this.salesReportsList = [
      {
        title: "Sales by Overview"
      },
      {
        title: "Sales By Hour of Day"
      },
      {
        title: "Sales By Day of Week"
      },
      {
        title: "Sales by Month"
      },
      {
        title: "Sales by Product"
      },
      {
        title: "Sales by Vendor"
      },
      {
        title: "Sales by Customer"
      },
      {
        title: "Sales By Discount Code"
      },

      {
        title: "Sales by Referring Site"
      },
      {
        title: "Sales By Channel"
      },
      {
        title: "Sales by Payment Method"
      }
    ];
    this.taxesReportsList = [
      {
        title: "Tax per Country"
      },
      {
        title: "Tax per State"
      }
    ];
    this.geoReportsList = [
      {
        title: "Sales By Country"
      },
      {
        title: "Sales By State"
      },
      {
        title: "Sales By City"
      }
    ];
  }

  ngOnInit() {}

  goToUrl(reportType, reportName) {
    this.router.navigateByUrl(
      `reportsDetail?type=${reportType}&name=${reportName}`
    );
    // this.router.navigate([
    //   ["/reports"],
    //   { queryParams: { type: reportType, name: reportName } }
    // ]);
    // this.router.navigateByUrl('/reports?id=37&username=jimmy')
  }
}
