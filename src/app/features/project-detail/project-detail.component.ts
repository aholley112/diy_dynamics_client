import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../shared/models/project.model';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Comment } from '../../shared/models/comment.model';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterModule, FormsModule, MatTooltipModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  isFavorite: boolean = false;
  currentUserId: number | null = null;
  favoriteId: number | null = null;
  favoriteProjectIds: number[] = [];
  comments: Comment[] = [];
  newCommentText: string = '';
  editCommentId: number | null = null;
  currentlyEditingCommentText: string = '';
  likeIds: { [projectId: number]: number } = {};
  showCommentBox: boolean = false;

  @ViewChild('commentInput') commentInputRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authenticationService.getCurrentUserId();
    this.route.params.subscribe(params => {
      const projectId = +params['id'];
      if (!isNaN(projectId)) {
      this.fetchProject(projectId);
    } else {
      console.error('Invalid project ID');
    }
    });
  }

  // Method to fetch the project details
  fetchProject(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project: any) => {
        this.project = project;
        this.isFavorite = project.is_favorite_project;
        this.favoriteId = project.favorite_id;
        this.fetchComments(project.id);

        project.material_names = Array.isArray(project.material_names)
        ? project.material_names.join(', ')
        : project.material_names;

      project.tool_names = Array.isArray(project.tool_names)
        ? project.tool_names.join(', ')
        : project.tool_names;
      },
      error: (error) => console.error('Error fetching project details', error)
    });
  }

  // Method to toggle the visibility of the comment box
  toggleCommentBox(): void {
    this.showCommentBox = !this.showCommentBox;
    if (this.showCommentBox) {
      setTimeout(() => this.focusCommentInput(), 0);
    }
  }

  // Method to check if the project is a favorite
  isProjectFavorite(projectId: number): boolean {
    return this.favoriteProjectIds.includes(projectId);
  }

  // Method to add the project to the user's favorites
  addToFavorites(): void {
    if (this.project) {
      this.userService.addProjectToFavorites(this.project.id).subscribe({
        next: (response) => {
          console.log('Added to favorites');
          this.isFavorite = true;
          this.favoriteId = response.favorite_id;
          if (this.project) {
            this.fetchProject(this.project.id);
          }
        },
        error: (error) => console.error('Error adding to favorites', error)
      });
    }
  }


  // Method to remove the project from the user's favorites
  removeFromFavorites(): void {
    if (this.project && this.favoriteId != null) {
      this.userService.removeProjectFromFavorites(this.favoriteId).subscribe({
        next: () => {
          console.log('Removed from favorites');
          this.isFavorite = false;
          if (this.project) {
            this.fetchProject(this.project.id);
          }
        },
        error: (error) => console.error('Error removing from favorites', error)
      });
    }
  }

  // Method to toggle the favorite status of the project
  toggleFavorite(): void {
    if (this.isFavorite) {
      this.removeFromFavorites();
    } else {
      this.addToFavorites();
    }
  }

  // Method to fetch the comments for the project
  fetchComments(projectId: number): void {
    this.projectService.getCommentsByProjectId(projectId).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (error) => console.error('Error fetching comments', error)
    });
  }

  // Method to add a comment to the project
  addComment(): void {
    if (this.project && this.newCommentText.trim()) {
      this.projectService.addComment(this.project.id, { text: this.newCommentText.trim() }).subscribe({
        next: (comment) => {
          console.log('New comment added:', comment);
          this.comments.push(comment);
          this.newCommentText = '';
        },
        error: (error) => console.error('Error adding comment', error)
      });
    }
  }

  // Method to start editing a comment
  startEditComment(comment: Comment): void {
    this.editCommentId = comment.id;
    this.currentlyEditingCommentText = comment.text;
  }

  // Method to save the edited comment
  saveEditedComment(comment: Comment): void {
    if (!this.editCommentId || !this.project) return;
    const updatedCommentData = { text: this.currentlyEditingCommentText };
    this.projectService.updateComment(this.project.id, this.editCommentId, updatedCommentData)
      .subscribe({
        next: (updatedComment) => {
          const index = this.comments.findIndex(c => c.id === updatedComment.id);
          if (index !== -1) {
            this.comments[index] = updatedComment;
          }
          this.editCommentId = null;
          this.currentlyEditingCommentText = '';
        },
        error: (error) => console.error('Error updating comment', error)
      });
  }

  // Method to delete a comment
  deleteComment(commentId: number): void {
    if (this.project) {
      this.projectService.deleteComment(this.project.id, commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
        },
        error: (error) => console.error('Error deleting comment', error)
      });
    }
  }

  // Method to like or unlike a project
  toggleLike(projectId: number): void {
    if (this.project) {
      if (this.project.isLiked) {
        const likeId = this.likeIds[this.project.id];
        if (likeId !== undefined) {
          this.projectService.removeLike(likeId).subscribe(() => {
            if (this.project) {
              this.project.isLiked = false;
              this.clearLikeIdForProject(this.project.id);
            }
          });
        }
      } else {
        this.projectService.addLike(projectId).subscribe(like => {
          if (this.project) {
            this.project.isLiked = true;
            this.storeLikeIdForProject(this.project.id, like.id);
          }
        });
      }
    }
  }

  // Method to focus the comment input.
  focusCommentInput(): void {
    this.commentInputRef.nativeElement.focus();
  }

  // Method to store the like ID for a project
  storeLikeIdForProject(projectId: number, likeId: number): void {
    this.likeIds[projectId] = likeId;
  }

  // Method to get the like ID for a project
  getLikeIdByProjectId(projectId: number): number | null {
    return this.likeIds[projectId] || null;
  }

  // Method to clear the like ID for a project
  clearLikeIdForProject(projectId: number): void {
    delete this.likeIds[projectId];
  }
}
