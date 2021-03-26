import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstallServiceService {

  constructor(private http: Http) {

  }
  checkStore(url) {
    return this.http.get(environment.apiUrl + 'checkuserexist/' + url).pipe(map((response: any) => response.json()));
  }
}
