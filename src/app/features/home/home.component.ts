import { Component, OnInit, } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectsComponent } from '../projects/projects.component';
import { CategoriesComponent } from '../categories/categories.component';
import { Category } from '../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from '../../shared/components/navbar/navbar.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ProjectsComponent, CategoriesComponent, CommonModule, NavigationBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  featuredProjects: Project[] = [];
  searchResults: Category[] = [];


  constructor(
    private categoryService: CategoryService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.loadFeaturedProjects();
  }

  // loadFeaturedProjects(): void {
  //   this.featuredProjects = [
  //     {
  //       id: 1,
  //       title: 'Garden Renovation Ideas',
  //       description: 'Transform your backyard with these creative garden renovation ideas.',
  //       isFavoriteProject: true,
  //       instructions: 'Start with assessing your space, choose a garden style, plan the layout, select plants, and add personal touches.',
  //       estimatedTimeToCompletion: '48 hours',
  //       userId: 1,
  //     },
  //     {
  //       id: 2,
  //       title: 'DIY Kitchen Storage Solutions',
  //       description: 'Increase your kitchen storage space with these simple DIY solutions.',
  //       isFavoriteProject: false,
  //       instructions: 'Evaluate your space, use vertical storage, add shelves, and utilize hidden spaces.',
  //       estimatedTimeToCompletion: '24 hours',
  //       userId: 2
  //     },
  //   ];
  // }
  handleSearch(searchText: string): void {
    console.log('Received search text:', searchText);
    if (!searchText.trim()) {
      this.searchResults = [];
      return;
    }
    this.categoryService.searchCategories(searchText).subscribe(
      (categories) => {
        this.searchResults = categories;
      },
      (error) => {
        console.error('Error searching categories', error);
      }
    );
  }
  clearSearchResults(): void {
    this.searchResults = [];
  }

}


