import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NavigationBarComponent } from './shared/components/navbar/navbar.component';

@Component({
	selector: 'app-root',
	standalone: true,
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [RouterOutlet, LazyLoadImageModule, NavigationBarComponent],
})
export class AppComponent {
  title = 'diy_dynamics_client';
}
