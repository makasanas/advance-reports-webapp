import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {

  public message: string;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.noDataCurrentMsg.subscribe(message => this.message = message);
    console.log(this.message);
  }

}
