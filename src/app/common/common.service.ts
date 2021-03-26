import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private noDataMsg = new BehaviorSubject('No data Found');
  noDataCurrentMsg = this.noDataMsg.asObservable();

  constructor() { }

  changeNoDataMsg(message: string) {
    this.noDataMsg.next(message);
  }
}
