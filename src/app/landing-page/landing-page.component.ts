import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HighscoreService } from '../services/highscore.service';
import { UserService } from '../services/user.service';
import { Highscore } from '../models/highscore.model';
import { AuthService } from '../services/authentication.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  // array of Highscore objects
  highscores: Highscore[] = [];
  // flag to toggle Highscore visibility
  showHighscores = false;
  // URL of express server
  apiUrl = 'http://localhost:3001';
  // username from logged in user
  username = '';

  // inject HttpClient, HighscoreService and UserService in this component
  constructor(private http: HttpClient, private router: Router, private highscoreService: HighscoreService, private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    // check if there is a logged in user
    if (!this.authService.isLoggedIn()) {
      alert('Login to access the landing page.');
      // redirect user to the login page
      this.router.navigate(['/login']);
    }
    // retrieve username from the user service
    this.username = this.userService.getUsername();
  }

  // send username and fake highscore to the backend
  sendHighscore() {
    // create fake data
    const highscoreData = {
      username: this.username,
      score: 100
    };

    // send POST request with highscoreData to /highscores
    // using observer object within the subscribe method:
    this.http.post(this.apiUrl + '/highscores', highscoreData).subscribe({
      // 'next' property represents the success callback
      next: (response) => {
        console.log('Success: ', response);
      },
      // 'error' property represents the error callback
      error: (error) => {
        console.log('Error sending highscore: ', error);
      }
    });
  };

  // fetch highscores from the database and display the results (toggle visibility)
  fetchHighscores() {
    // hide highscores if it was already visible
    if (this.showHighscores) {
      this.showHighscores = false;
    }
    // retrieve Highscores and show them on the page
    else {
      this.highscoreService.getHighscores().subscribe({
        next: (highscores) => {
          this.highscores = highscores;
          // set flag to true to display the highscores
          this.showHighscores = true;
          console.log('Highscores retrieved successfully.');
        },
        error: (error) => {
          console.log('Error retrieving highscores:', error);
        }
      }
      )
    }
  }

  // logout user
  logout() {
    // retrieve token from the client's local storage
    const token = localStorage.getItem('authToken') as string;
    // logout user with authService
    this.authService.logout(token).subscribe({
      next: () => {
        // remove token from client's local storage
        localStorage.removeItem('authToken');
        // delete current user
        this.userService.deleteUser();
        console.log('Logout successful.')
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log('There was an error in the logout: ', error);
      }
    })
  }

}
