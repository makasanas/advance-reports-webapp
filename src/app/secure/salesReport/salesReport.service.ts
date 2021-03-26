import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Http, Headers, Response } from "@angular/http";
import { environment } from "../../../environments/environment";
import { Subject } from "rxjs";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class SalesReportService {
  constructor(private http: Http, private router: Router) {}

  private shopUrl = localStorage.getItem("shopUrl");

  createAuthorizationHeader(headers: Headers) {
    headers.append(
      "Authorization",
      localStorage.getItem("token").replace(/\"/g, "")
    );
  }

  getReport(data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .post(environment.apiUrl + "getReport/", data, { headers: headers })
      .pipe(map((response: any) => response.json()));
  }
}
