import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { EventService } from '../../core/services/event.service';
import { ReservationService } from '../../core/services/reservation.service';
import { EventoDetalle } from '../../models/api.models';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, CurrencyPipe],
  template: `
    <a class="back-link" routerLink="/reservas">← Volver a sesiones</a>

    <section class="status-card" *ngIf="loadingDetalle()">
      <h1>Cargando sesion</h1>
      <p class="helper">Estamos recuperando el detalle del evento.</p>
    </section>

    <section class="status-card" *ngIf="!loadingDetalle() && errorMessage()">
      <h1>No se ha podido cargar la sesion</h1>
      <p class="helper">{{ errorMessage() }}</p>
      <a class="login-link" routerLink="/reservas">Volver a sesiones</a>
    </section>

    <section class="status-card" *ngIf="!loadingDetalle() && !errorMessage() && !evento()">
      <h1>Sesion no disponible</h1>
      <p class="helper">No hemos encontrado el evento solicitado.</p>
      <a class="login-link" routerLink="/reservas">Volver a sesiones</a>
    </section>

    <section class="detail-card" *ngIf="!loadingDetalle() && !errorMessage() && evento() as data">
      <div class="detail-main">
        <p class="eyebrow">
          <img src="alienmilk-ufo.svg" alt="" aria-hidden="true" />
          <span>{{ data.tipoEvento }}</span>
        </p>
        <h1>{{ data.nombre }}</h1>
        <p class="description">{{ data.descripcion }}</p>

        <div class="detail-grid">
          <div><span>Fecha</span><strong>{{ data.fechaInicio | date: 'dd/MM/yyyy' }}</strong></div>
          <div><span>Precio por plaza</span><strong>{{ data.precio | currency: 'EUR' }}</strong></div>
          <div><span>Duración</span><strong>{{ data.duracion }} minutos</strong></div>
          <div><span>Aforo</span><strong>{{ data.aforoMaximo }}</strong></div>
          <div><span>Estado</span><strong>{{ data.estado }}</strong></div>
          <div><span>Dirección</span><strong>{{ data.direccion }}</strong></div>
        </div>
      </div>

      <aside class="reserve-box">
        <h2>Reservar tu plaza</h2>

        <ng-container *ngIf="authService.isAuthenticated(); else loginPrompt">
          <label>
            Plazas
            <input type="number" [(ngModel)]="cantidad" min="1" max="10" />
          </label>

          <div class="total-box">
            <span>Total</span>
            <strong>{{ totalReserva() | currency: 'EUR' }}</strong>
          </div>

          <label>
            Observaciones
            <textarea [(ngModel)]="observaciones" rows="4"></textarea>
          </label>

          <button type="button" (click)="reservar()" [disabled]="loading()">
            {{ loading() ? 'Reservando...' : 'Confirmar acceso' }}
          </button>
        </ng-container>

        <ng-template #loginPrompt>
          <p class="helper">Necesitas iniciar sesion para apartar plaza en esta sesion.</p>
          <a class="login-link" [routerLink]="['/login']" [queryParams]="{ redirectTo: currentUrl }">Ir a login</a>
        </ng-template>

        <p class="error" *ngIf="errorMessage()">{{ errorMessage() }}</p>
      </aside>
    </section>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      isolation: isolate;
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      padding: 2.3rem 0 3rem;
      background: #1f2430;
    }

    :host::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url('/alienmilk-ufo-white.svg');
      background-repeat: repeat;
      background-size: 76px 76px;
      opacity: 0.045;
      pointer-events: none;
      z-index: 0;
    }

    .back-link {
      display: block;
      position: relative;
      z-index: 1;
      width: min(1180px, calc(100% - 2rem));
      margin: 0 auto 1rem;
      text-decoration: none;
      color: #d97706;
      font-weight: 700;
    }

    .detail-card {
      position: relative;
      z-index: 1;
      width: min(1180px, calc(100% - 2rem));
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.5fr 0.9fr;
      gap: 1.5rem;
      padding: 1.8rem;
      border-radius: 28px;
      background: white;
      box-shadow: 0 24px 44px rgba(23, 32, 51, 0.08);
    }

    .status-card {
      position: relative;
      z-index: 1;
      width: min(1180px, calc(100% - 2rem));
      margin: 0 auto;
      padding: 1.8rem;
      border-radius: 28px;
      background: white;
      box-shadow: 0 24px 44px rgba(23, 32, 51, 0.08);
      display: grid;
      gap: 0.8rem;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
      font-weight: 800;
      color: #d97706;
    }

    .eyebrow img {
      width: 1rem;
      height: 1rem;
      display: block;
      flex: 0 0 auto;
      filter: brightness(0) saturate(100%) invert(53%) sepia(95%) saturate(1097%)
        hue-rotate(2deg) brightness(95%) contrast(95%);
    }

    h1 {
      font-family: 'Nunito', sans-serif;
      margin: 0.4rem 0 0.8rem;
      font-size: clamp(1.8rem, 3vw, 2.8rem);
    }

    h2 {
      font-family: 'Nunito', sans-serif;
      margin: 0;
    }

    .description,
    .helper {
      color: #64748b;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 0.9rem;
      margin-top: 1.4rem;
    }

    .detail-grid div,
    .reserve-box {
      padding: 1rem;
      border-radius: 18px;
      background: #f8fafc;
    }

    .detail-grid span {
      display: block;
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 0.35rem;
    }

    .reserve-box {
      display: grid;
      gap: 0.9rem;
      align-self: start;
    }

    .total-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.95rem 1rem;
      border-radius: 14px;
      background: rgba(217, 119, 6, 0.08);
      color: #1e293b;
    }

    .total-box span {
      font-size: 0.9rem;
      color: #64748b;
    }

    .total-box strong {
      font-family: 'Nunito', sans-serif;
      font-size: 1.15rem;
    }

    label {
      display: grid;
      gap: 0.45rem;
      font-weight: 600;
    }

    input,
    textarea {
      padding: 0.85rem 1rem;
      border-radius: 14px;
      border: 1px solid rgba(23, 32, 51, 0.14);
      font: inherit;
    }

    button,
    .login-link {
      border: 0;
      border-radius: 16px;
      padding: 0.95rem 1rem;
      font-family: 'Nunito', sans-serif;
      background: linear-gradient(135deg, #d97706, #f59e0b);
      color: white;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      text-align: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
    }

    button:hover,
    .login-link:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 24px rgba(199, 104, 26, 0.22);
    }

    button:focus-visible,
    .login-link:focus-visible {
      outline: 2px solid rgba(199, 104, 26, 0.35);
      outline-offset: 2px;
    }

    .error {
      color: #b91c1c;
      font-weight: 700;
    }

    @media (max-width: 900px) {
      .detail-card {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class EventDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly reservationService = inject(ReservationService);
  readonly authService = inject(AuthService);

  readonly evento = signal<EventoDetalle | null>(null);
  readonly loadingDetalle = signal(true);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  cantidad = 1;
  observaciones = '';
  currentUrl = '';

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    const idEvento = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(idEvento) || idEvento <= 0) {
      this.loadingDetalle.set(false);
      this.errorMessage.set('El identificador del evento no es valido.');
      return;
    }

    this.loadingDetalle.set(true);
    this.errorMessage.set('');
    this.evento.set(null);

    this.eventService.getDetalle(idEvento).subscribe({
      next: (data) => {
        this.evento.set(data);
        this.loadingDetalle.set(false);
      },
      error: (err) => {
        this.loadingDetalle.set(false);
        this.errorMessage.set(err?.error?.message ?? 'No se ha podido cargar el detalle de la sesion.');
      },
    });
  }

  reservar(): void {
    const evento = this.evento();
    if (!evento) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.reservationService.reservar(evento.idEvento, this.cantidad, this.observaciones).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/reservas');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message ?? 'No se ha podido completar la reserva de plaza.');
      },
    });
  }

  totalReserva(): number {
    const evento = this.evento();
    if (!evento) {
      return 0;
    }

    const plazas = Number.isFinite(this.cantidad) ? this.cantidad : 0;
    return evento.precio * Math.max(plazas, 0);
  }
}
