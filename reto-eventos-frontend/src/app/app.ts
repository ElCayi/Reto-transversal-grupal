import { Component, inject } from '@angular/core';
import { NgIf, ViewportScroller } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [NgIf, RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  constructor() {
    this.authService.loadSession()?.subscribe();
  }

  goToSection(event: Event, sectionId: string): void {
    event.preventDefault();

    this.router.navigate(['/'], { fragment: sectionId }).then(() => {
      setTimeout(() => this.viewportScroller.scrollToAnchor(sectionId));
    });
  }

  shouldShowFooter(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    return path === '/' || path === '/login' || path === '/registro';
  }

  logout(): void {
    this.authService.logout();
  }
}
