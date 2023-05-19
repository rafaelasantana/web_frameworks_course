import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // array to store the signup users
  signupUsers: any[] = [];

  // // object stores user's login credentials
  // loginObj: any = {
  //   email: '',
  //   password: '',
  // };

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
    console.log("this user: ");
    console.warn(this.loginForm.value);
    console.log("all users: ");
    console.log(this.signupUsers);

    // check if there is a match for this user in the signupUsers
    const userMatch = this.signupUsers.find(m => m.email == this.loginForm.value['email'] && m.password == this.loginForm.value['password']);
    // alert that login works
    if (userMatch != undefined) {
      alert("Login successful.");
    }
    else {
      alert("Login failed.");
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
}
