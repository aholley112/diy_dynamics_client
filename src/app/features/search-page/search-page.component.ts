import { Component, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { SearchService } from '../../core/services/search.service';
import { Category } from '../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements OnInit {
  searchText: string = '';
  filterOption: string = 'all';
  searchResults: { categories: Category[], projects: Project[] } | null = null;

  constructor(private searchService: SearchService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const query = params['query'] || '';
      this.searchText = query;
      this.performSearch(query);
    });
  }

  performSearch(query: string): void {
    if (query) {
      if (this.filterOption === 'categories') {
        // Call search service for categories only
        this.searchService.searchCategories(query).subscribe({
          next: (categories) => {
            this.searchResults = { categories, projects: [] };
          },
          error: (error) => {
            console.error('Search failed:', error);
          }
        });
      } else if (this.filterOption === 'projects') {
        // Call search service for projects only
        this.searchService.searchProjects(query).subscribe({
          next: (projects) => {
            this.searchResults = { categories: [], projects };
          },
          error: (error) => {
            console.error('Search failed:', error);
          }
        });
      } else {
        this.searchService.searchAll(query).subscribe({
          next: (data) => {
            this.searchResults = data;
          },
          error: (error) => {
            console.error('Search failed:', error);
          }
        });
      }
    }
  }

  onFilterChange(newFilter: string): void {
    this.filterOption = newFilter;
    this.performSearch(this.searchText);
  }

  goToCategory(categoryId: string): void {
    this.router.navigate(['/category-projects', categoryId]);
  }

  goToProject(projectId: number): void {
    this.router.navigate(['/project-detail', projectId]);
  }

}
