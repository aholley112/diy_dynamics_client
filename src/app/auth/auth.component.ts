import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent implements OnInit {
  isSignInMode = true;
  authForm: FormGroup;
  isError: boolean = false;
  errorMsg: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    // Create the form group with the FormBuilder and Validators
    this.authForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Lifecycle hook to set up initial component state
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const action = params['action'];
      this.isSignInMode = action !== 'sign-up';
      this.authForm.reset();
      this.errorMsg = null;
      this.successMessage = null;
    });
  }

  // Method to toggle between sign-in and sign-up modes
  toggleAuthMode(): void {
    const newMode = this.isSignInMode ? 'sign-up' : 'log-in';
    this.router.navigate(['/auth'], { queryParams: { action: newMode } });
    this.isSignInMode = !this.isSignInMode;
  }

  // Method to handle form submission
  onAuthSubmit(): void {
  if (!this.authForm.valid) {
    this.errorMsg = "Please fill out the form correctly.";
    return;
  }

  // Handles sign-in and sign-up logic based on the mode
  if (this.isSignInMode) {
    const { username, password } = this.authForm.value;
    this.authService.login(username, password).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        this.router.navigate(['/']);
        this.errorMsg = null;
        this.successMessage = "Login successful!";
      },
      error: (error) => {
        this.isError = true;
        this.errorMsg = "Log in failed. Please try again.";
      }
    });
  } else {
    // Extract form values
    const { firstName, lastName, email, username, password } = this.authForm.value;
    this.authService.signup(firstName, lastName, email, username, password).subscribe({
      next: (res) => {
        this.successMessage = "Signup successful. Please log in.";
        this.toggleAuthMode();
        this.errorMsg = null;
      },
      error: (error) => {
        this.isError = true;
        this.errorMsg = "Signup failed. Please try again.";
      }
    });
  }
}
}
