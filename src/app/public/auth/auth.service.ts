import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Http, Headers, Response } from '@angular/http';
import { environment } from './../../../environments/environment';

@Injectable()
export class AuthService {

    constructor(private http: Http) { }

    getAccessToken(query) {
        return this.http.get(environment.apiUrl + 'shopify' + query).pipe(map((response: any) => response.json()));
    }
}