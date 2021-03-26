import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivePlanService } from './active-plan.service'
import { from } from 'rxjs';
import { SecureService } from "./../secure.service";


@Component({
  selector: 'app-active-plan',
  templateUrl: './active-plan.component.html',
  styleUrls: ['./active-plan.component.scss']
})
export class ActivePlanComponent implements OnInit {
  public planID: any;
  public loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activePlanService: ActivePlanService,
    private secureService: SecureService) {

  }

  ngOnInit() {
    this.loading = true;
    this.planID = this.route.snapshot.queryParamMap.get('charge_id');
    this.activePlanService.activePlan(this.planID).subscribe((res) => {
      this.secureService.fetchUser().subscribe((res) => {
        this.secureService.setUser(res.data);
        this.loading = false;
        this.router.navigate([], { queryParams: { page: null } });
      }, err => {
        console.log(err);
      });
    }, err => {
      // console.log(err);
    });
  }

}
