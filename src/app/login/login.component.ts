import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // inject router module to this component
  constructor(private router: Router, private userService: UserService, private authService: AuthService) { }

  // array to store the signup users
  signupUsers: any[] = [];

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  ngOnInit() {
    // get all signup users from the local storage
    const localData = localStorage.getItem('signupUsers');
    if (localData != null) {
      this.signupUsers = JSON.parse(localData);
    }
  }

  // check user's credentials and login
  onLogin() {
    // get email and password from the form
    const email = this.loginForm.value['email'] as string;
    const password = this.loginForm.value['password'] as string;

    // login with authService
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful.');
        // save user's token to the local storage
        localStorage.setItem('authToken', response.token);
        // set user's username to the userService
        this.userService.setUsername(response.username);
        // redirect logged in user to the landing page
        this.router.navigate(['/landing']);
      },
      error: (error) => {
        console.log('There was an error logging in: ', error);
        alert('Login failed');
      }
    })
  }

  get email() {
    return this.loginForm.get('email');
  }
}
