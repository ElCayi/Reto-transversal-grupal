import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';
import { EventoListado, Reserva, Usuario } from '../../models/api.models';

@Component({
  selector: 'app-admin-reservations-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, CurrencyPipe],
  template: `
    <section class="page-card panel-card">
      <div class="header">
        <div>
          <p class="eyebrow">
            <img src="alienmilk-ufo.svg" alt="" aria-hidden="true" />
            <span>Zona admin · Reservas</span>
          </p>
          <h1>Gestion de reservas por usuario</h1>
          <p class="helper">
            Busca un usuario, revisa sus reservas y crea o cancela manualmente desde el panel admin.
          </p>
        </div>
      </div>

      <section class="admin-shell">
        <aside class="sidebar">
          <h3>Panel admin</h3>
          <nav>
            <a routerLink="/admin">Sesiones</a>
            <a routerLink="/admin">Usuarios</a>
            <a routerLink="/admin">Tipos</a>
            <a routerLink="/admin">Perfiles</a>
            <a class="active">Reservas</a>
          </nav>
        </aside>

        <div class="admin-content">

      <section class="panel-block">
        <label class="field">
          <span>Buscar usuario por nombre o username</span>
          <input
            [(ngModel)]="filtro"
            (ngModelChange)="onFiltroChange()"
            name="filtroUsuario"
            placeholder="ej. ana o lopez"
          />
        </label>

        <div class="usuario-list" *ngIf="filtro.trim().length > 0">
          <ng-container *ngIf="usuariosFiltrados().length > 0; else sinResultados">
            <article *ngFor="let u of usuariosFiltrados()" [class.activo]="usuarioSeleccionado()?.username === u.username">
              <div>
                <strong>{{ u.nombre }} {{ u.apellidos }}</strong>
                <p>{{ u.username }} · {{ u.email }} · {{ u.perfil }}</p>
              </div>
              <button type="button" class="ghost" (click)="seleccionarUsuario(u)">Seleccionar</button>
            </article>
          </ng-container>
          <ng-template #sinResultados>
            <p class="vacio">No hay usuarios que coincidan con "{{ filtro }}".</p>
          </ng-template>
        </div>
      </section>

      <ng-container *ngIf="usuarioSeleccionado() as user">
        <section class="panel-block">
          <h2>Reservas de {{ user.nombre }} ({{ user.username }})</h2>
          <div class="reserva-list" *ngIf="reservas().length > 0; else sinReservas">
            <article *ngFor="let r of reservas()">
              <div>
                <strong>{{ r.nombreEvento }}</strong>
                <p>
                  {{ r.fechaInicioEvento | date: 'dd/MM/yyyy' }} ·
                  {{ r.cantidad }} {{ r.cantidad === 1 ? 'entrada' : 'entradas' }} ·
                  {{ r.precioVenta | currency: 'EUR' }} · {{ r.estadoEvento }}
                </p>
                <p class="obs" *ngIf="r.observaciones">"{{ r.observaciones }}"</p>
              </div>
              <button type="button" class="danger" (click)="cancelarReserva(r.idReserva)">Cancelar</button>
            </article>
          </div>
          <ng-template #sinReservas>
            <p class="vacio">Este usuario no tiene reservas.</p>
          </ng-template>
        </section>

        <section class="panel-block">
          <h2>Crear reserva manual</h2>
          <form (ngSubmit)="crearReserva()" class="form-grid">
            <label class="field">
              <span>Sesion (solo activas)</span>
              <select [(ngModel)]="nuevaReserva.idEvento" name="reservaIdEvento" required>
                <option [ngValue]="0">Selecciona sesion</option>
                <option *ngFor="let e of eventosActivos()" [ngValue]="e.idEvento">
                  {{ e.nombre }} · {{ e.fechaInicio | date: 'dd/MM/yyyy' }} · {{ e.precio | currency: 'EUR' }}
                </option>
              </select>
            </label>
            <label class="field">
              <span>Cantidad (1 a 10)</span>
              <input
                [(ngModel)]="nuevaReserva.cantidad"
                name="reservaCantidad"
                type="number"
                min="1"
                max="10"
                required
              />
            </label>
            <label class="field">
              <span>Observaciones (opcional)</span>
              <input
                [(ngModel)]="nuevaReserva.observaciones"
                name="reservaObservaciones"
                placeholder="ej. mesa cerca del lacteobar"
              />
            </label>
            <button type="submit">Crear reserva</button>
          </form>
        </section>
      </ng-container>

          <p class="feedback" *ngIf="feedback()" [class.error]="esError()">{{ feedback() }}</p>
        </div>
      </section>
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
      display: grid;
      gap: 1.5rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .admin-shell {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .sidebar {
      position: sticky;
      top: 1rem;
      padding: 1.2rem;
      border-radius: 24px;
      background: #d2dae4;
      border: 1px solid rgba(71, 85, 105, 0.22);
      display: grid;
      gap: 0.8rem;
    }

    .sidebar h3 {
      margin: 0 0 0.2rem;
      font-family: 'Nunito', sans-serif;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #475569;
      padding-left: 0.4rem;
    }

    .sidebar nav {
      display: grid;
      gap: 0.35rem;
    }

    .sidebar nav a {
      background: transparent;
      color: #334155;
      text-align: left;
      padding: 0.75rem 0.95rem;
      border-radius: 12px;
      cursor: pointer;
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      font-size: 0.98rem;
      text-decoration: none;
      transition: background 150ms ease, color 150ms ease;
    }

    .sidebar nav a:hover {
      background: #fef3c7;
      color: #d97706;
    }

    .sidebar nav a.active {
      background: linear-gradient(135deg, #d97706, #f59e0b);
      color: white;
      cursor: default;
    }

    .admin-content {
      display: grid;
      gap: 1.5rem;
      min-width: 0;
    }

    @media (max-width: 900px) {
      .admin-shell {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: static;
      }

      .sidebar nav {
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        overflow-x: auto;
      }
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
      filter: brightness(0) saturate(100%) invert(53%) sepia(95%) saturate(1097%)
        hue-rotate(2deg) brightness(95%) contrast(95%);
    }

    h1 {
      margin: 0;
      font-family: 'Nunito', sans-serif;
      font-size: clamp(1.8rem, 3vw, 2.4rem);
    }

    h2 {
      margin: 0 0 0.8rem;
      font-family: 'Nunito', sans-serif;
    }

    .helper {
      color: #64748b;
      margin: 0.3rem 0 0;
    }

    .panel-block {
      padding: 1.4rem;
      border-radius: 24px;
      background: #d2dae4;
      border: 1px solid rgba(71, 85, 105, 0.22);
      display: grid;
      gap: 1rem;
      align-content: start;
    }

    .field {
      display: grid;
      gap: 0.3rem;
    }

    .field > span {
      font-size: 0.82rem;
      font-weight: 700;
      color: #475569;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      padding-left: 0.25rem;
    }

    input,
    select {
      width: 100%;
      max-width: 100%;
      padding: 0.85rem 1rem;
      border-radius: 14px;
      border: 1px solid rgba(23, 32, 51, 0.12);
      font: inherit;
      background: white;
      box-sizing: border-box;
    }

    button {
      border: 0;
      border-radius: 14px;
      padding: 0.7rem 1.1rem;
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      cursor: pointer;
      background: linear-gradient(135deg, #d97706, #f59e0b);
      color: white;
    }

    .ghost {
      background: #fef3c7;
      color: #d97706;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      padding: 0.7rem 1.1rem;
      border-radius: 14px;
      font-weight: 700;
    }

    .danger {
      background: #fee2e2;
      color: #b91c1c;
    }

    .usuario-list,
    .reserva-list {
      display: grid;
      gap: 0.7rem;
    }

    .usuario-list article,
    .reserva-list article {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 0.95rem 1rem;
      border-radius: 18px;
      background: #f8fafc;
    }

    .usuario-list article.activo {
      outline: 2px solid #d97706;
      background: #fef3c7;
    }

    .reserva-list .obs {
      color: #475569;
      font-style: italic;
      margin: 0.25rem 0 0;
    }

    p {
      margin: 0;
    }

    .reserva-list p,
    .usuario-list p {
      color: #64748b;
      font-size: 0.9rem;
    }

    .vacio {
      color: #64748b;
      font-style: italic;
    }

    .form-grid {
      display: grid;
      gap: 0.9rem;
      grid-template-columns: 2fr 1fr 2fr;
      align-items: end;
    }

    .form-grid button {
      grid-column: 1 / -1;
      justify-self: start;
    }

    .feedback {
      color: #166534;
      font-weight: 700;
    }

    .feedback.error {
      color: #b91c1c;
    }

    @media (max-width: 760px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .usuario-list article,
      .reserva-list article {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `,
})
export class AdminReservationsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly usuarios = signal<Usuario[]>([]);
  readonly eventosActivos = signal<EventoListado[]>([]);
  readonly usuarioSeleccionado = signal<Usuario | null>(null);
  readonly reservas = signal<Reserva[]>([]);
  readonly feedback = signal('');
  readonly esError = signal(false);

  filtro = '';
  nuevaReserva = { idEvento: 0, cantidad: 1, observaciones: '' };

  readonly usuariosFiltrados = computed(() => {
    const q = this.filtro.trim().toLowerCase();
    if (!q) {
      return [];
    }
    return this.usuarios().filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.nombre.toLowerCase().includes(q) ||
        (u.apellidos ?? '').toLowerCase().includes(q),
    );
  });

  ngOnInit(): void {
    this.adminService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cdr.markForCheck();
      },
    });
    this.adminService.getEventos().subscribe({
      next: (data) => {
        this.eventosActivos.set(data.filter((e) => e.estado === 'ACTIVO'));
        this.cdr.markForCheck();
      },
    });
  }

  onFiltroChange(): void {
    // computed reacciona automaticamente; nada que hacer aqui
  }

  seleccionarUsuario(u: Usuario): void {
    this.usuarioSeleccionado.set(u);
    this.cargarReservas(u.username);
    this.nuevaReserva = { idEvento: 0, cantidad: 1, observaciones: '' };
    this.feedback.set('');
  }

  private cargarReservas(username: string): void {
    this.adminService.getReservasUsuario(username).subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.cdr.markForCheck();
      },
      error: (err) => this.mostrarError(err, 'No se han podido cargar las reservas.'),
    });
  }

  cancelarReserva(idReserva: number): void {
    if (!confirm('¿Cancelar esta reserva?')) {
      return;
    }
    this.adminService.cancelarReservaAdmin(idReserva).subscribe({
      next: () => {
        this.feedback.set('Reserva cancelada.');
        this.esError.set(false);
        const user = this.usuarioSeleccionado();
        if (user) {
          this.cargarReservas(user.username);
        }
      },
      error: (err) => this.mostrarError(err, 'No se ha podido cancelar la reserva.'),
    });
  }

  crearReserva(): void {
    const user = this.usuarioSeleccionado();
    if (!user || !this.nuevaReserva.idEvento) {
      this.mostrarMensaje('Selecciona un usuario y una sesion antes de crear la reserva.', true);
      return;
    }
    this.adminService
      .crearReservaParaUsuario(user.username, this.nuevaReserva.idEvento, {
        cantidad: this.nuevaReserva.cantidad,
        observaciones: this.nuevaReserva.observaciones,
      })
      .subscribe({
        next: () => {
          this.mostrarMensaje('Reserva creada correctamente.', false);
          this.cargarReservas(user.username);
          this.nuevaReserva = { idEvento: 0, cantidad: 1, observaciones: '' };
        },
        error: (err) => this.mostrarError(err, 'No se ha podido crear la reserva.'),
      });
  }

  private mostrarMensaje(msg: string, error: boolean): void {
    this.feedback.set(msg);
    this.esError.set(error);
    this.cdr.markForCheck();
  }

  private mostrarError(err: unknown, fallback: string): void {
    const error = err as { error?: string | { message?: string; error?: string } };
    const message =
      typeof error.error === 'string' ? error.error : (error.error?.message ?? error.error?.error);
    this.mostrarMensaje(message ?? fallback, true);
  }
}
