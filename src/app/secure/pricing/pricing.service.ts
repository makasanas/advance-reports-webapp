import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PricingService {

    constructor(private http: Http) { }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', localStorage.getItem('token').replace(/\"/g, ""));
    }

    acceptPlan(data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(environment.apiUrl + 'recurring/plan', data, { headers: headers }).pipe(map((response: any) => response.json()));
    }

    getPlan() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(environment.apiUrl + 'recurring/plan', { headers: headers }).pipe(map((response: any) => response.json()));
    }

    basePlane() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(environment.apiUrl + 'recurring/plan/deactive', { headers: headers }).pipe(map((response: any) => response.json()));
    }

    getProductCount() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(environment.apiUrl + 'getproductcount', { headers: headers }).pipe(map((response: any) => response.json()));
    }
}
