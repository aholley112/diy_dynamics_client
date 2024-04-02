import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, NgxSkeletonLoaderModule],
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

  @Output() onFormClose = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize the form
    this.initializeForm();
    this.route.queryParams.subscribe(params => {
      const mode = params['action'];
      // Setting the authentication mode based on the query parameter
      this.isSignInMode = mode !== 'sign-up';
      this.adjustFormValidators();
    });
  }

  // Initializing the fom with default values and validators
  initializeForm() {
    this.authForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

// Adjusting the form validators based on the authentication mode
  adjustFormValidators() {
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

  // Toggling the authentication mode
  toggleAuthMode() {
    this.isSignInMode = !this.isSignInMode;
    this.errorMsg = '';
    this.successMessage = '';
    this.formSubmitted = false;
    this.authForm.reset();
    this.adjustFormValidators();
  }

  // Handling the form submission
  onAuthSubmit(): void {
    this.formSubmitted = true;
   if (!this.authForm.valid) {
      return;
    }

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
  // Logging in
// Logging in
login(username: string, password: string): void {
  this.isLoading = true;

  this.authenticationService.login(username, password).subscribe({
    next: (res) => {
        this.isLoading = false;
        this.authenticationService.setToken(res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        this.onFormClose.emit();
        this.router.navigate(['/home']);
      },
    error: (err) => {
      this.isLoading = false;
      this.errorMsg = 'Failed to login: ' + err.message;
    }
  });
}


  // Signing up
  signup(firstName: string, lastName: string, email: string, username: string, password: string) {
    this.authenticationService.signup(firstName, lastName, email, username, password).subscribe({
      next: (res) => {
        this.successMessage = 'Signup successful! Please log in with your new credentials.';
        this.errorMsg = '';
        this.formSubmitted = false;
        this.isSignInMode = true;
        this.authForm.patchValue({ username, password: '' });
      },
      error: (err) => {
        this.errorMsg = 'Failed to sign up: ' + err.message;
        this.formSubmitted = false;
      }
    });
  }
}
