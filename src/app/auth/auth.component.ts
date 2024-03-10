import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../core/services/authentication.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  isSignInMode = true;
  errorMsg: string = '';
  successMessage: string = '';
  formSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.route.queryParams.subscribe(params => {
      const mode = params['action'];
      this.isSignInMode = mode !== 'sign-up';
      this.adjustFormValidators();
    });
  }

  initializeForm() {
    this.authForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

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

  toggleAuthMode() {
    this.isSignInMode = !this.isSignInMode;
    this.adjustFormValidators();
  }

  onAuthSubmit() {
    this.formSubmitted = true;
    if (this.authForm.invalid) {
      this.errorMsg = 'Form is invalid. Please check your input.';
      console.log('Form controls validity:');
      Object.keys(this.authForm.controls).forEach(key => {
        console.log(key, this.authForm.controls[key].valid);
      });
      return;
    }

    const { firstName, lastName, email, username, password } = this.authForm.value;

    if (this.isSignInMode) {
      this.login(username, password);
    } else {
      this.signup(firstName, lastName, email, username, password);
    }
  }

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        this.authService.setToken(res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMsg = 'Failed to login. Please check your credentials.';
      }
    });
  }

  signup(firstName: string, lastName: string, email: string, username: string, password: string) {
    this.authService.signup(firstName, lastName, email, username, password).subscribe({
      next: (res) => {
        console.log('Signup successful:', res);
        this.successMessage = 'Signup successful! Please log in with your new credentials.';

        // Switch to login mode.
        this.isSignInMode = true;

        this.errorMsg = '';

        this.authForm.patchValue({
          username: username,
          password: ''
        });

      },
      error: (err) => {
        console.error('Signup failed:', err);
        this.errorMsg = 'Failed to sign up. Please try again.';
      }
    });
  }
}
