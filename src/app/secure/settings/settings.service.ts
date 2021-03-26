import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Http, Headers, Response } from "@angular/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class SettingsService {
  constructor(private http: Http) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append(
      "Authorization",
      localStorage.getItem("token").replace(/\"/g, "")
    );
  }

  getPlan() {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .get(environment.apiUrl + "recurring" + "/plan", { headers: headers })
      .pipe(map((response: any) => response.json()));
  }
  deactivePlan(data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .delete(environment.apiUrl + "recurring/plan/deactive/" + data, {
        headers: headers
      })
      .pipe(map((response: any) => response.json()));
  }
  getUser() {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .get(environment.apiUrl + "user/profile", { headers: headers })
      .pipe(map((response: any) => response.json()));
  }
  syncProducts() {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .get(environment.apiUrl + "sync/products", { headers: headers })
      .pipe(map((response: any) => response.json()));
  }

  syncOrders() {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .get(environment.apiUrl + "sync/orders", { headers: headers })
      .pipe(map((response: any) => response.json()));
  }

  getSyncData() {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http
      .get(environment.apiUrl + "syncDetails", { headers: headers })
      .pipe(map((response: any) => response.json()));
  }
}
