import { Component, OnInit, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstallServiceService } from './install.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss']
})
export class InstallComponent implements OnInit {
  
  public shopUrl: string;
  public url: string;
  public installForm: FormGroup;
  public existing: boolean = false;
  public tmpUrl: string;
  public loading: boolean = true;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private _inService: InstallServiceService, private router: Router) {
    this.installForm = this.formBuilder.group({
      shopUrl: [environment.store, Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['shop']) {
        this.shopUrl = this.route.snapshot.queryParamMap.get('shop');
        this.checkExisting(this.shopUrl)
      } else {
        this.loading = false;
      }
    })
  }

  install() {
    if (!this.installForm.invalid) {
      if (this.installForm.controls.shopUrl.value.includes('http')) {
        let tmp = this.installForm.controls.shopUrl.value.split('//')[1];
         console.log(tmp);

        this.checkExisting(tmp);
      } else {
        this.checkExisting(this.installForm.controls.shopUrl.value);
      }
    }
    else {
      Object.keys(this.installForm.controls).forEach(key => {
        this.installForm.get(key).markAsDirty();
      });
    }

  }

  checkExisting(url) {
    this.tmpUrl = url;
    var installUrl = `https://${this.tmpUrl}/admin/oauth/authorize?client_id=${environment.appId}&scope=${environment.appScope}&redirect_uri=${window.location.origin}/app/auth`;
    console.log(installUrl);
     document.location.href = installUrl;
  }
}
