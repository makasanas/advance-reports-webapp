import { Component, OnInit, Renderer2 } from "@angular/core";
import { SecureService } from "./secure.service";
import {  Router } from "@angular/router";
import { environment } from "./../../environments/environment";

declare var $crisp;
declare global {
  interface Window {
    $crisp: any;
    CRISP_WEBSITE_ID: any;
  }
}
import * as Sentry from "@sentry/angular";

@Component({
  selector: "app-secure",
  templateUrl: "./secure.component.html",
  styleUrls: ["./secure.component.scss"]
})
export class SecureComponent implements OnInit {
  public user = false;
  public fetchUser = false;
  public userData;
  public fullSidebar: boolean = true;

  constructor(
    private router: Router,
    private secureService: SecureService,
    private renderer: Renderer2
  ) {
    this.secureService.checkToken().subscribe(
      res => {
        this.user = true;
        this.getUser();
      },
      err => {
        this.user = false;
        localStorage.removeItem("token");
        localStorage.removeItem("shopUrl");
        this.router.navigate(["/install"]);
      }
    );
  }

  ngOnInit() {}

  getUser() {
    this.secureService.fetchUser().subscribe(
      res => {
        this.secureService.setUser(res.data);
        this.fetchUser = true;
        this.loadChat();

        Sentry.configureScope((scope) => {
          scope.setUser({
            'id': res.data._id,
            'username': res.data.shopUrl
          });
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  loadChat() {
    this.userData = this.secureService.getUser();
    if (
      !this.userData.admin &&
      this.userData.domain != "dev-srore.myshopify.com"
    ) {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = environment.crispId;
      this.addJsToElement("https://client.crisp.chat/l.js").onload = () => {
        window.$crisp.push(["set", "user:email", [this.userData.email]]);
        window.$crisp.push(["set", "user:nickname", [this.userData.storeName]]);
        window.$crisp.push(["set", "user:phone", [this.userData.phone]]);
        let tmpProductCount = this.userData.productCount
          ? this.userData.productCount
          : 0;
        window.$crisp.push([
          "set",
          "session:segments",
          [
            [
              this.userData.recurringPlanName,
              this.userData.shopUrl,
              tmpProductCount.toString()
            ],
            true
          ]
        ]);

        // window.$crisp.push(["set", "session:data", [[
        //   ['shopUrl', this.userData.shopUrl],
        //   ['App Plan', this.userData.recurringPlanName],
        //   ['Credit', this.userData.credit],
        //   ['Shopify Plan', this.userData.plan_display_name]
        // ]]])
      };
    }
  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.async = true;
    this.renderer.appendChild(document.body, script);
    return script;
  }

  setUser() {}

  changeSidebar(event) {
    this.fullSidebar = event;
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
  }
}
