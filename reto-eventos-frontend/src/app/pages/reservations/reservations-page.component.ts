import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EventService } from '../../core/services/event.service';
import { ReservationService } from '../../core/services/reservation.service';
import { EventoListado, Reserva } from '../../models/api.models';

@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterLink],
  template: `
    <section class="page-card panel-card">
      <div class="header">
        <div>
          <p class="eyebrow">
            <img src="alienmilk-ufo.svg" alt="" aria-hidden="true" />
            <span>Zona cliente</span>
          </p>
          <h1>Panel de usuario</h1>
          <p class="helper">Consulta sesiones disponibles, entra al detalle y gestiona tus reservas.</p>
        </div>
      </div>

      <section class="panel-block available-block">
        <div class="block-header">
          <div>
            <h2>Sesiones disponibles</h2>
            <p class="block-helper">Accede al detalle para consultar la sesión y reservar tu plaza.</p>
          </div>
          <span class="count subtle">{{ eventos().length }} sesiones</span>
        </div>

        <p class="empty" *ngIf="!eventos().length">Ahora mismo no hay sesiones activas disponibles.</p>

        <div class="event-list" *ngIf="eventos().length">
          <article class="event-card" *ngFor="let evento of eventos()">
            <div>
              <p class="event-type">{{ evento.tipoEvento }}</p>
              <h3>{{ evento.nombre }}</h3>
              <p class="event-meta">
                {{ evento.fechaInicio | date: 'dd/MM/yyyy' }} · {{ evento.precio | currency: 'EUR' }}
              </p>
            </div>
            <a class="event-link" [routerLink]="['/eventos', evento.idEvento]">Consultar y reservar</a>
          </article>
        </div>
      </section>

      <section class="panel-block reserved-block">
        <div class="block-header">
          <div>
            <h2>Mis reservas</h2>
            <p class="block-helper">Consulta tus sesiones reservadas y cancela si lo necesitas.</p>
          </div>
        </div>

        <p class="empty" *ngIf="!reservas().length">Todavia no has reservado ninguna sesion activa.</p>

        <div class="reservation-list" *ngIf="reservas().length">
          <article class="reservation-card" *ngFor="let reserva of reservas()">
            <div class="reservation-info">
              <h3>{{ reserva.nombreEvento }}</h3>
              <p>{{ reserva.fechaInicioEvento | date: 'dd/MM/yyyy' }} · {{ reserva.estadoEvento }}</p>
              <p class="reservation-note" *ngIf="reserva.observaciones">
                <span>Observaciones:</span> {{ reserva.observaciones }}
              </p>
            </div>
            <div class="summary">
              <span>{{ reserva.cantidad }} plazas</span>
              <strong>{{ reserva.precioVenta | currency: 'EUR' }}</strong>
            </div>
            <button type="button" (click)="cancelar(reserva.idReserva)">Cancelar reserva</button>
          </article>
        </div>
      </section>

      <p class="error" *ngIf="errorMessage()">{{ errorMessage() }}</p>
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
      padding: 2.4rem 0 3rem;
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

    .page-card {
      position: relative;
      z-index: 1;
      width: min(1180px, calc(100% - 2rem));
      margin: 0 auto;
      padding: 1.8rem;
      border-radius: 28px;
      background: white;
      box-shadow: 0 24px 44px rgba(23, 32, 51, 0.08);
    }

    .panel-card {
      display: grid;
      gap: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
    }

    .header {
      margin-top: 0.65rem;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      margin: 0 0 0.45rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.9rem;
      font-weight: 800;
      color: #d97706;
    }

    .eyebrow img {
      width: 1.05rem;
      height: 1.05rem;
      display: block;
      flex: 0 0 auto;
      filter: brightness(0) saturate(100%) invert(53%) sepia(95%) saturate(1097%)
        hue-rotate(2deg) brightness(95%) contrast(95%);
    }

    h1 {
      margin: 0;
      font-size: clamp(2.3rem, 4.4vw, 3.1rem);
      line-height: 1.02;
    }

    h1,
    h2,
    h3 {
      font-family: 'Nunito', sans-serif;
    }

    .helper,
    .block-helper,
    .empty,
    .event-meta {
      color: #64748b;
    }

    .helper {
      margin-top: 0.1rem;
      font-size: 1.16rem;
      line-height: 1.7;
    }

    .count {
      padding: 0.55rem 0.9rem;
      border-radius: 999px;
      background: #fef3c7;
      color: #d97706;
      font-weight: 700;
    }

    .count.subtle {
      background: #f8fafc;
      color: #475569;
    }

    .panel-block {
      display: grid;
      gap: 1rem;
    }

    .available-block {
      padding: 1.4rem;
      border-radius: 24px;
      background: #d2dae4;
      border: 1px solid rgba(71, 85, 105, 0.22);
    }

    .reserved-block {
      padding: 1.4rem;
      border-radius: 24px;
      background: #d2dae4;
      border: 1px solid rgba(71, 85, 105, 0.22);
      margin-top: 1.1rem;
    }

    .block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .block-header h2,
    .event-card h3,
    .reservation-card h3 {
      margin: 0;
    }

    .event-list,
    .reservation-list {
      display: grid;
      gap: 1rem;
    }

    .event-card,
    .reservation-card {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      padding: 1rem 1.2rem;
      border-radius: 20px;
      background: #f8fafc;
    }

    .reservation-card {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 8.5rem auto;
      align-items: center;
      column-gap: 1.2rem;
    }

    .event-type {
      margin: 0 0 0.2rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
      font-weight: 800;
      color: #d97706;
    }

    .event-meta,
    .reservation-card p {
      margin: 0.25rem 0 0;
    }

    .reservation-info {
      display: grid;
      gap: 0.15rem;
      min-width: 0;
    }

    .reservation-note {
      font-size: 0.94rem;
      line-height: 1.5;
      color: #475569;
      max-width: 58ch;
    }

    .reservation-note span {
      font-weight: 700;
      color: #1e293b;
    }

    .event-link {
      text-decoration: none;
      color: #d97706;
      font-weight: 700;
      white-space: nowrap;
    }

    .summary {
      display: grid;
      gap: 0.2rem;
      justify-items: end;
      width: 8.5rem;
      color: #475569;
    }

    button {
      border: 0;
      border-radius: 14px;
      padding: 0.85rem 1rem;
      font-family: 'Nunito', sans-serif;
      background: #fee2e2;
      color: #b91c1c;
      font-weight: 700;
      cursor: pointer;
      transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }

    button:hover {
      transform: translateY(-1px);
      background: #fecaca;
      box-shadow: 0 10px 18px rgba(185, 28, 28, 0.14);
    }

    button:focus-visible {
      outline: 2px solid rgba(185, 28, 28, 0.25);
      outline-offset: 2px;
    }

    .error {
      margin-top: 1rem;
    }

    .error {
      color: #b91c1c;
      font-weight: 700;
    }

    @media (max-width: 760px) {
      .header,
      .block-header,
      .event-card,
      .reservation-card {
        flex-direction: column;
        align-items: stretch;
      }

      .reservation-card {
        display: flex;
      }

      .summary {
        justify-items: start;
      }
    }
  `,
})
export class ReservationsPageComponent implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly eventService = inject(EventService);

  readonly reservas = signal<Reserva[]>([]);
  readonly eventos = signal<EventoListado[]>([]);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadEventos();
    this.loadReservas();
  }

  cancelar(idReserva: number): void {
    this.reservationService.cancelar(idReserva).subscribe({
      next: () => this.loadReservas(),
      error: (err) =>
        this.errorMessage.set(err?.error?.message ?? 'No se ha podido cancelar la reserva.'),
    });
  }

  private loadReservas(): void {
    this.reservationService.getMine().subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.errorMessage.set('');
      },
      error: (err) =>
        this.errorMessage.set(err?.error?.message ?? 'No se han podido cargar tus sesiones reservadas.'),
    });
  }

  private loadEventos(): void {
    this.eventService.getActivos().subscribe({
      next: (data) => this.eventos.set(data),
      error: (err) =>
        this.errorMessage.set(err?.error?.message ?? 'No se han podido cargar las sesiones disponibles.'),
    });
  }
}
