import { Component, Input } from '@angular/core';
import { Project } from '../shared/models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
@Input() projects: Project[] = [];
}
