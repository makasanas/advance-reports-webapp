import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { environment } from "../../../environments/environment";
import { switchMap, debounceTime } from "rxjs/operators"; // RxJS v6

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit {
  public code: string;
  public hmac: string;
  public shop: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params["hmac"] || params["token"]) {
        this.hmac = this.route.snapshot.queryParamMap.get("hmac");
        this.shop = this.route.snapshot.queryParamMap.get("shop");
        this.getAccessToken(this.route.snapshot["_routerState"].url);
      } else {
        this.router.navigate(["/install"]);
      }
    });
  }

  getAccessToken(query) {
    this.authService.getAccessToken(query).subscribe(
      res => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("shopUrl", res.data.shopUrl);
        this.router.navigate(["/reports"]);
        if (!localStorage.getItem("askForHelpPopup")) {
          localStorage.setItem("askForHelpPopup", "true");
        }
      },
      err => {
        this.router.navigate(["/install"]);
      }
    );
  }
}
