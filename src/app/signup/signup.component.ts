import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  // array to store the signed-up users
  signupUsers: any[] = [];

  // signup form
  signUpForm!: FormGroup;

  // default user credentials
  defaultUserCredentials: any = {
    email: 'test@test.at',
    password: '12345678',
  };

  ngOnInit() {
    // add default user credentials to the signupUsers array
    this.addDefaultUser();

    // create signup form
    this.createForm();
  }

  // creates a signup form with input validators
  createForm() {
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repeatPassword: new FormControl('', [Validators.required]),
      company: new FormControl({
        value: "FH Technikum Wien",
        disabled: true
      }),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    },
    {
      validators: matchPassword,
    });
  }

  // adds default user credentials to the signupUsers array
  addDefaultUser() {
    // add default credentials to signupUsers array
    this.signupUsers.push(this.defaultUserCredentials);
    // add signupUsers to the local storage
    localStorage.setItem('signupUsers', JSON.stringify(this.signupUsers));
  }

  // adds current user to the users array and add it to the local storage
  registerUser() {
    // display form values in the console
    console.warn(this.signUpForm.value);
    // add this user to the signupUsers array
    this.signupUsers.push(this.signUpForm.value);
    // update signupUsers in the local storage with the new user
    localStorage.setItem('signupUsers', JSON.stringify(this.signupUsers));
    // print all registered users:
    console.log("all users:");
    console.log(this.signupUsers);
  }
}

// checks if the password and repeatPassword match. If they do, returns null, else returns a validation error
export const matchPassword : ValidatorFn = (control : AbstractControl) : ValidationErrors | null => {
  // get values from the form
  let password = control.get('password');
  let confirmPassword = control.get('repeatPassword');
  // compare passwords
  if (password && confirmPassword && password?.value !== confirmPassword?.value) {
    // return validation error if they do not match
    return {
      passwordMatchError: true
    };
  }
  // return null if they match
  return null;
}