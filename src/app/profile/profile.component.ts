import { Component, OnInit } from '@angular/core';
import { Profile } from '../shared/models/profile.model';
import { AuthenticationService } from '../core/services/authentication.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../core/services/profile.service';
import { NavigationBarComponent } from '../shared/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavigationBarComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  userId: number = 1; // Assume a logged-in user ID
  editing: boolean = false;
  selectedFile: File | null = null;

  constructor(private profileService: ProfileService, private http: HttpClient) {}

  ngOnInit() {
    this.getProfile(this.userId);
  }

  getProfile(userId: number) {
    this.profileService.getProfile(userId).subscribe(data => {
      this.profile = data;
    });
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  updateProfile() {
    const formData = new FormData();
    formData.append('profile[bio]', this.profile.bio);

    if (this.selectedFile) {
      formData.append('profile[profile_picture]', this.selectedFile);
    }

    this.profileService.updateProfile(this.userId, formData).subscribe(data => {
      console.log('Profile updated successfully');
      this.toggleEdit(); 
      this.getProfile(this.userId);
    });
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
    }
  }
}
