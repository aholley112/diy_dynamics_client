import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  isSignInMode = true;
  errorMsg: string = '';
  successMessage: string = '';
  formSubmitted: boolean = false;
  isLoading: boolean = false;
  showAuthForm: boolean = true;

  @Output() onFormClose = new EventEmitter<void>();
  @Output() onLoginSuccess = new EventEmitter<void>();
  @Input() set authAction(action: 'sign-up' | 'log-in') {
    // Set the mode based on the input
    this.isSignInMode = action === 'log-in';
    if (this.authForm) {
      this.authForm.reset();
      this.adjustFormValidators();
    }
  }

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  // Method to initialize the form with validators
  initializeForm() {
    this.authForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.adjustFormValidators();
  }

  // Method to adjust form validators based on the current sign-up/log in mode
  adjustFormValidators() {
    if (this.authForm) {
      const controls = this.authForm.controls;
      if (!this.isSignInMode) {
        controls['firstName'].setValidators([Validators.required]);
        controls['lastName'].setValidators([Validators.required]);
        controls['email'].setValidators([Validators.required, Validators.email]);
      } else {
        controls['firstName'].clearValidators();
        controls['lastName'].clearValidators();
        controls['email'].clearValidators();
      }
      controls['firstName'].updateValueAndValidity();
      controls['lastName'].updateValueAndValidity();
      controls['email'].updateValueAndValidity();
    }
  }

  // Method to toggle between sign-in and sign-up modes
  toggleAuthMode() {
    this.isSignInMode = !this.isSignInMode;
    this.adjustFormValidators();
  }

  // Method to handle form submission
  onAuthSubmit() {
    this.formSubmitted = true;
    if (this.authForm.valid) {
      const username = this.authForm.get('username')?.value;
      const password = this.authForm.get('password')?.value;
      if (this.isSignInMode) {
        this.login(username, password);
      } else {
        const firstName = this.authForm.get('firstName')?.value;
        const lastName = this.authForm.get('lastName')?.value;
        const email = this.authForm.get('email')?.value;
        this.signup(firstName, lastName, email, username, password);
      }
    }
  }

// Method to handle login
login(username: string, password: string): void {
  this.isLoading = true;
  this.authenticationService.login(username, password).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.authenticationService.setToken(res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      this.onLoginSuccess.emit();
      this.closeAuthForm();
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMsg = 'Failed to login: ' + err.error.message;
    }
  });
}

// Method to handle signup
signup(firstName: string, lastName: string, email: string, username: string, password: string): void {
  this.isLoading = true;
  this.authenticationService.signup(firstName, lastName, email, username, password).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.successMessage = 'Signup successful! Please log in with your new credentials.';
      this.errorMsg = '';
      this.formSubmitted = false;
      this.isSignInMode = true;
      this.authForm.patchValue({ username, password: '' });
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMsg = 'Failed to sign up: ' + err.error.message;
      this.formSubmitted = false;
    }
  });
}

// Method to close the form
closeAuthForm() {
  this.showAuthForm = false;
  this.onFormClose.emit();
}
}
