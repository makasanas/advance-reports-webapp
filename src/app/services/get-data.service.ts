import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GetDataService {
  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      // console.log(data);
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/newData.json");
  }

  public getReportDataJSON(): Observable<any> {
    return this.http.get("./assets/reportData.json");
  }
}
