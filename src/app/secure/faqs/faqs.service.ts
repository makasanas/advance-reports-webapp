import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class FaqsService {
    constructor(private http: Http) { }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', localStorage.getItem('token').replace(/\"/g, ""));
    }


    sendMessage(data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(environment.apiUrl + 'contact',data , { headers: headers }).pipe(map((response: any) => response.json()));
    }
    
    getUser() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(environment.apiUrl + 'user/profile', { headers: headers }).pipe(map((response: any) => response.json()));
    }
}
