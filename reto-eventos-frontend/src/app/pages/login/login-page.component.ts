import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="login-wrapper">
      <div class="login-shell">
        <div class="login-copy">
          <div class="eyebrow-brand">
            <img src="alienmilk-ufo.svg" alt="Logo AlienMilk Sessions" />
            <span class="eyebrow-brand-name">AlienMilk</span>
            <span class="eyebrow-brand-subtitle">Sessions</span>
          </div>
          <h1>Bienvenido a AlienMilk.</h1>
          <p class="lead">
            Accede para reservar sesiones, explorar el laboratorio y moverte por el universo
            AlienMilk con tu perfil.
          </p>
          <p class="signup-copy">
            ¿No tienes cuenta?
            <a routerLink="/registro">Regístrate gratis</a>
          </p>

          <div class="demo-box">
            <p class="demo-title">Usuarios de prueba</p>
            <p><strong>admin</strong>, <strong>ana</strong> y <strong>luis</strong></p>
            <p>Contraseña: <strong>1234</strong></p>
          </div>
        </div>

        <div class="login-card">
          <p class="card-kicker">Iniciar sesion</p>
          <form (ngSubmit)="submit()">
            <label>
              <span class="sr-only">Usuario</span>
              <input [(ngModel)]="username" name="username" placeholder="Usuario" required />
            </label>

            <label>
              <span class="sr-only">Contraseña</span>
              <input
                [(ngModel)]="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                required
              />
            </label>

            <button type="submit" class="dark-btn submit-btn" [disabled]="loading()">
              {{ loading() ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>

          <p class="error" *ngIf="errorMessage()">{{ errorMessage() }}</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .login-wrapper {
      min-height: 74vh;
      display: grid;
      align-items: center;
      padding: 3rem 0 1rem;
    }

    .login-shell {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
      gap: clamp(2rem, 5vw, 5rem);
      align-items: center;
    }

    .login-copy {
      display: grid;
      gap: 1.35rem;
      max-width: 38rem;
    }

    .lead {
      margin: 0;
      color: #475569;
      font-size: 1.08rem;
      line-height: 1.75;
    }

    .signup-copy {
      margin: -0.15rem 0 0;
      color: #475569;
      font-size: 1rem;
      line-height: 1.6;
    }

    .signup-copy a {
      color: #d97706;
      font-weight: 700;
      text-decoration: none;
    }

    .signup-copy a:hover {
      text-decoration: underline;
    }

    .demo-box {
      width: min(100%, 28rem);
      padding: 1rem 1.15rem;
      border-radius: 22px;
      background: #fff;
      border: 1px solid rgba(23, 32, 51, 0.08);
      box-shadow: 0 18px 30px rgba(23, 32, 51, 0.06);
    }

    .demo-box p {
      margin: 0;
      color: #475569;
      line-height: 1.7;
    }

    .demo-title {
      margin-bottom: 0.3rem !important;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 800;
      color: #d97706 !important;
    }
    .login-card {
      width: min(480px, 100%);
      min-height: 23.2rem;
      padding: 1.65rem 2rem 1.8rem;
      border-radius: 32px;
      background: white;
      font-family: 'Nunito', sans-serif;
      border: 1px solid rgba(23, 32, 51, 0.08);
      box-shadow: 0 24px 44px rgba(23, 32, 51, 0.08);
    }

    .eyebrow-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      margin: 0;
    }

    .eyebrow-brand img {
      width: 1.55rem;
      height: 1.55rem;
      display: block;
      flex: 0 0 auto;
    }

    .eyebrow-brand-name {
      font-family: 'Nunito', sans-serif;
      font-size: 1.1rem;
      font-weight: 800;
      color: #20242b;
    }

    .eyebrow-brand-subtitle {
      font-family: 'Times New Roman', Times, serif;
      font-size: 0.82rem;
      font-weight: 600;
      color: #20242b;
    }

    h1 {
      margin: 0;
      font-family: 'Nunito', sans-serif;
      font-size: clamp(2.4rem, 4vw, 3.4rem);
      line-height: 1.02;
      color: #20242b;
    }

    .card-kicker {
      margin: 1.35rem 0 1rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
      font-weight: 800;
      color: #d97706;
    }

    form {
      display: grid;
      gap: 1.1rem;
    }

    label {
      display: grid;
      gap: 0;
      font-weight: 600;
      color: #20242b;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    input {
      padding: 0.95rem 1rem;
      border-radius: 16px;
      border: 1px solid rgba(23, 32, 51, 0.14);
      font: inherit;
      background: #fff;
    }

    input:focus-visible {
      outline: 2px solid rgba(217, 119, 6, 0.24);
      outline-offset: 2px;
    }

    .submit-btn {
      margin-top: 0.55rem;
      width: 100%;
      border: 0;
    }

    .error {
      margin-top: 1rem;
      color: #b91c1c;
      font-weight: 700;
    }

    @media (max-width: 900px) {
      .login-shell {
        grid-template-columns: 1fr;
      }

      .login-wrapper {
        padding-top: 1.5rem;
      }
    }
  `,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  username = '';
  password = '';
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  submit(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        this.loading.set(false);
        const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
        if (redirectTo) {
          this.router.navigateByUrl(redirectTo);
          return;
        }

        this.router.navigateByUrl(user.perfil === 'ROLE_ADMON' ? '/admin' : '/reservas');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Credenciales incorrectas o usuario sin permisos.');
      },
    });
  }
}
