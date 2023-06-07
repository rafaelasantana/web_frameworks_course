import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  // signup form
  signUpForm!: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
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

  // register user with the authService
  registerUser() {
    console.warn(this.signUpForm.value);
    // register user with the authService
    this.authService.register(this.signUpForm.value).subscribe({
      next: () => {
        console.log('Signup successful.');
      },
      error: (error) => {
        console.log('There was an error signing up: ', error);
      }

    })
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