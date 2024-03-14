import { Component, OnInit } from '@angular/core';
import { Profile } from '../shared/models/profile.model';
import { AuthenticationService } from '../core/services/authentication.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../core/services/profile.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationBarComponent } from '../shared/navbar/navbar.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavigationBarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  profileForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      bio: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    if (this.authService.isLoggedIn()) {
      this.profileService.getProfile().subscribe({
        next: (data) => {
          this.profile = data;
          this.profileForm.patchValue({
            bio: data.bio,
          });
        },
        error: (error) => {
          this.error = 'Failed to load profile';
        }
      });
    } else {
      // Need to come back to to decide what to do if user isn't logged in.
    }
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.loading = true;
      if (this.authService.isLoggedIn()) {
        this.profileService.updateProfile(this.profileForm.value).subscribe({
          next: () => {
            this.loading = false;
            // Handle successful update
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Failed to update profile';
            // Handle error
          }
        });
      } else {
        // Need to come back to and decide what to do if user isn't logged in.
      }
    }
  }
}
