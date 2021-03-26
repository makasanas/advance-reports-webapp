import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable()
export class SecureService {

    public collectionData = [];
    public user = [];

    constructor(private http: Http, private router: Router) { }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', localStorage.getItem('token').replace(/\"/g, ""));
    }

    checkToken() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(environment.apiUrl + 'user/checktoken', { headers: headers }).pipe(map((response: any) => response.json()));
    }

    fetchUser() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(environment.apiUrl + 'user/profile', { headers: headers }).pipe(map((response: any) => response.json()));
    }

    setUser(data) {
        this.user = data;
    }

    getUser() {
        return this.user;
    }

    sync(syncType: string) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(environment.apiUrl + 'sync/' + syncType, { headers: headers }).pipe(map((response: any) => response.json()));
      }

    sendRoute(user) {
        if (!this.router.url.includes('activeplan')) {
            if (!user.recurringPlanType || user.recurringPlanType === 'Free') {
                this.router.navigate(['/pricing']);
            } else {

            }
        }
    }

    changeAppStatus(data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.put(environment.apiUrl + 'appStatus', data, { headers: headers }).pipe(map((response: any) => response.json()));
    }
}