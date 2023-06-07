import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Highscore } from '../models/highscore.model';


// make this service available throughout the app
@Injectable({
    providedIn: 'root'
})

export class HighscoreService {

    // URL of express server
    private apiUrl = 'http://localhost:3001';

    constructor(private http: HttpClient) { }

    // returns an Observable for an array of Highscore objects stored in the in-memory database
    getHighscores(): Observable<Highscore[]> {
        // send GET request to '/highscores' endpoint
        return this.http.get<Highscore[]>(this.apiUrl + '/highscores');
    }

}
