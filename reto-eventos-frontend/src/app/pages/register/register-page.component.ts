import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="register-wrapper">
      <div class="register-shell">
        <div class="register-copy">
          <div class="eyebrow-brand">
            <img src="alienmilk-ufo.svg" alt="Logo AlienMilk Sessions" />
            <span class="eyebrow-brand-name">AlienMilk</span>
            <span class="eyebrow-brand-subtitle">Sessions</span>
          </div>
          <h1>Crea tu cuenta en AlienMilk.</h1>
          <p class="lead">
            Regístrate para reservar sesiones, descubrir nuevas procedencias y entrar en el
            laboratorio con tu perfil de cliente.
          </p>
          <p class="login-copy">
            ¿Ya tienes cuenta?
            <a routerLink="/login">Inicia sesión</a>
          </p>

          <div class="demo-box">
            <p class="demo-title">Alta cliente</p>
            <p>Tu cuenta se crea directamente como <strong>cliente</strong>.</p>
            <p>Después del registro entrarás automáticamente en la app.</p>
          </div>
        </div>

        <div class="register-card">
          <p class="card-kicker">Registrarse</p>
          <form (ngSubmit)="submit()">
            <div class="form-grid">
              <label>
                <span class="sr-only">Nombre</span>
                <input [(ngModel)]="nombre" name="nombre" placeholder="Nombre" required />
              </label>

              <label>
                <span class="sr-only">Apellidos</span>
                <input [(ngModel)]="apellidos" name="apellidos" placeholder="Apellidos" required />
              </label>
            </div>

            <label>
              <span class="sr-only">Email</span>
              <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required />
            </label>

            <label>
              <span class="sr-only">Usuario</span>
              <input [(ngModel)]="username" name="username" placeholder="Usuario" required />
            </label>

            <label>
              <span class="sr-only">Dirección</span>
              <input [(ngModel)]="direccion" name="direccion" placeholder="Dirección" />
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
              {{ loading() ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </form>

          <p class="error" *ngIf="errorMessage()">{{ errorMessage() }}</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .register-wrapper {
      min-height: 74vh;
      display: grid;
      align-items: center;
      padding: 3rem 0 1rem;
    }

    .register-shell {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 520px);
      gap: clamp(2rem, 5vw, 5rem);
      align-items: center;
    }

    .register-copy {
      display: grid;
      gap: 1.35rem;
      max-width: 38rem;
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
      font-family: 'Arial', Times, serif;
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

    .lead {
      margin: 0;
      color: #475569;
      font-size: 1.08rem;
      line-height: 1.75;
    }

    .login-copy {
      margin: -0.15rem 0 0;
      color: #475569;
      font-size: 1rem;
      line-height: 1.6;
    }

    .login-copy a {
      color: #d97706;
      font-weight: 700;
      text-decoration: none;
    }

    .login-copy a:hover {
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

    .register-card {
      width: min(520px, 100%);
      padding: 1.9rem 2rem 2.05rem;
      border-radius: 32px;
      background: white;
      font-family: 'Nunito', sans-serif;
      border: 1px solid rgba(23, 32, 51, 0.08);
      box-shadow: 0 24px 44px rgba(23, 32, 51, 0.08);
    }

    .card-kicker {
      margin: 0 0 1rem;
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
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
      .register-shell {
        grid-template-columns: 1fr;
      }

      .register-wrapper {
        padding-top: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  nombre = '';
  apellidos = '';
  email = '';
  username = '';
  direccion = '';
  password = '';

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  submit(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.register({
      username: this.username,
      password: this.password,
      email: this.email,
      nombre: this.nombre,
      apellidos: this.apellidos,
      direccion: this.direccion,
    }).subscribe({
      next: () => {
        this.authService.login(this.username, this.password).subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigateByUrl('/reservas');
          },
          error: () => {
            this.loading.set(false);
            this.router.navigateByUrl('/login');
          },
        });
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error?.error?.message ?? 'No se ha podido crear la cuenta.');
      },
    });
  }
}
