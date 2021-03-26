import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Http, Headers, Response , Jsonp} from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class DashboradService {
	
    constructor(private http: Http) { }

    getAccessToken() {
        return this.http.get(environment.apiUrl + 'shopify/auth').pipe(map((response: any) => response.json()));
    }
}