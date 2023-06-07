import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// make this service available throughout the app
@Injectable({
    providedIn: 'root'
})

export class AuthService {
    // URL to express server
    private apiUrl = 'http://localhost:3001';

    constructor(private http: HttpClient) {}

    // user registration
    register(user: any): Observable<any> {
        // send POST request to the '/users' endpoint
        return this.http.post(this.apiUrl + '/users', user);
    }

    // user login
    login(email: string, password: string) : Observable<any>{
        // send POST request to the '/sessions' endpoint
        return this.http.post(this.apiUrl + '/sessions', { email, password } )
    }

    // user logout
    logout(token: string) : Observable<any>{
        // create a header with the token for the user
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
        // send DELETE request with the headers to the '/sessions' endpoint
        return this.http.delete(this.apiUrl + '/sessions', { headers });
    }

    // returns true if the user is logged in
    isLoggedIn() : boolean {
        // check if there is a token set for this session
        const token = localStorage.getItem('authToken');
        // return true if the token exists, false otherwise
        return !!token;
    }
}