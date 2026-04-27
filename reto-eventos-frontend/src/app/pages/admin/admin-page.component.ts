import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminService } from '../../core/services/admin.service';
import {
  EventoListado,
  EventoPayload,
  Perfil,
  PerfilPayload,
  TipoEvento,
  TipoEventoPayload,
  Usuario,
  UsuarioPayload,
} from '../../models/api.models';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, CurrencyPipe],
  template: `
    <section class="page-card panel-card">
      <div class="header">
        <div>
          <p class="eyebrow">
            <img src="alienmilk-ufo.svg" alt="" aria-hidden="true" />
            <span>Zona admin</span>
          </p>
          <h1>Control de AlienMilk Sessions</h1>
          <p class="helper">
            Revisa y gestiona sesiones, usuarios, tipos, perfiles y reservas desde la cabina central.
          </p>
        </div>
      </div>

      <section class="admin-shell">
        <aside class="sidebar">
          <h3>Panel admin</h3>
          <nav>
            <button
              type="button"
              [class.active]="activeTab() === 'sesiones'"
              (click)="setTab('sesiones')"
            >
              Sesiones
            </button>
            <button
              type="button"
              [class.active]="activeTab() === 'usuarios'"
              (click)="setTab('usuarios')"
            >
              Usuarios
            </button>
            <button
              type="button"
              [class.active]="activeTab() === 'tipos'"
              (click)="setTab('tipos')"
            >
              Tipos
            </button>
            <button
              type="button"
              [class.active]="activeTab() === 'perfiles'"
              (click)="setTab('perfiles')"
            >
              Perfiles
            </button>
            <a routerLink="/admin/reservas">Gestionar reservas por usuario</a>
          </nav>
        </aside>

        <div class="admin-content">

      <section class="panel-block summary-block">
        <div class="stats">
          <div><span>Eventos</span><strong>{{ eventos().length }}</strong></div>
          <div><span>Usuarios</span><strong>{{ usuarios().length }}</strong></div>
          <div><span>Tipos</span><strong>{{ tipos().length }}</strong></div>
          <div><span>Perfiles</span><strong>{{ perfiles().length }}</strong></div>
        </div>
      </section>

      <section class="admin-grid" *ngIf="activeTab() === 'sesiones'">
        <form class="panel form-panel" (ngSubmit)="guardarEvento()">
          <div class="block-header compact">
            <div>
              <h2>{{ eventoEditandoId === null ? 'Alta de sesion' : 'Editar sesion' }}</h2>
              <p class="block-helper">Crea y administra nuevas sesiones de Alien Milk.</p>
            </div>
            <button
              *ngIf="eventoEditandoId !== null"
              type="button"
              class="ghost"
              (click)="cancelarEdicionEvento()"
            >
              Nueva
            </button>
          </div>

          <label class="field">
            <span>Nombre</span>
            <input [(ngModel)]="eventoForm.nombre" name="eventoNombre" placeholder="Nombre de la sesion" required />
          </label>
          <label class="field">
            <span>Descripcion</span>
            <textarea
              [(ngModel)]="eventoForm.descripcion"
              name="eventoDescripcion"
              rows="3"
              placeholder="Describe brevemente la sesion"
            ></textarea>
          </label>
          <label class="field">
            <span>Fecha de inicio</span>
            <input [(ngModel)]="eventoForm.fechaInicio" name="eventoFechaInicio" type="date" required />
          </label>
          <label class="field">
            <span>Direccion</span>
            <input [(ngModel)]="eventoForm.direccion" name="eventoDireccion" placeholder="Lugar donde se celebra" required />
          </label>
          <label class="field">
            <span>Duracion (minutos)</span>
            <input
              [(ngModel)]="eventoForm.duracion"
              name="eventoDuracion"
              type="number"
              placeholder="ej. 90"
              required
            />
          </label>
          <label class="field">
            <span>Aforo maximo (personas)</span>
            <input
              [(ngModel)]="eventoForm.aforoMaximo"
              name="eventoAforoMaximo"
              type="number"
              placeholder="ej. 50"
              required
            />
          </label>
          <label class="field">
            <span>Minimo de asistencia (personas)</span>
            <input
              [(ngModel)]="eventoForm.minimoAsistencia"
              name="eventoMinimoAsistencia"
              type="number"
              placeholder="ej. 10"
              required
            />
          </label>
          <label class="field">
            <span>Precio (€)</span>
            <input
              [(ngModel)]="eventoForm.precio"
              name="eventoPrecio"
              type="number"
              step="0.01"
              placeholder="ej. 20.00"
              required
            />
          </label>

          <label class="field">
            <span>Tipo de sesion</span>
            <select [(ngModel)]="eventoForm.idTipo" name="eventoIdTipo" required>
              <option [ngValue]="0">Selecciona tipo</option>
              <option *ngFor="let tipo of tipos()" [ngValue]="tipo.idTipo">{{ tipo.nombre }}</option>
            </select>
          </label>

          <label class="field">
            <span>Estado</span>
            <select [(ngModel)]="eventoForm.estado" name="eventoEstado">
              <option value="ACTIVO">Activo</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="TERMINADO">Terminado</option>
            </select>
          </label>

          <button type="submit">
            {{ eventoEditandoId === null ? 'Crear sesion' : 'Guardar sesion' }}
          </button>
        </form>

        <div class="panel wide list-panel">
          <div class="block-header">
            <div>
              <h2>Sesiones</h2>
              <p class="block-helper">Edita, destaca, cancela o elimina eventos.</p>
            </div>
          </div>
          <div class="table-list">
            <article *ngFor="let evento of eventos()">
              <div>
                <strong>{{ evento.nombre }}</strong>
                <p>{{ evento.tipoEvento }} · {{ evento.fechaInicio | date: 'dd/MM/yyyy' }}</p>
              </div>
              <div class="actions">
                <span>{{ evento.precio | currency: 'EUR' }}</span>
                <button type="button" class="ghost" (click)="editarEvento(evento.idEvento)">Editar</button>
                <button type="button" class="danger" (click)="borrarEvento(evento.idEvento)">Borrar</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="admin-grid" *ngIf="activeTab() === 'usuarios'">
        <form class="panel form-panel" (ngSubmit)="guardarUsuario()">
          <div class="block-header compact">
            <div>
              <h2>{{ usuarioEditandoUsername === null ? 'Alta usuario' : 'Editar usuario' }}</h2>
              <p class="block-helper">
                {{
                  usuarioEditandoUsername === null
                    ? 'Define el usuario y su perfil.'
                    : 'Edita los datos del usuario sin cambiar username ni password.'
                }}
              </p>
            </div>
            <button
              *ngIf="usuarioEditandoUsername !== null"
              type="button"
              class="ghost"
              (click)="cancelarEdicionUsuario()"
            >
              Nuevo
            </button>
          </div>

          <input
            [(ngModel)]="usuarioForm.username"
            name="usuarioUsername"
            placeholder="Username"
            [disabled]="usuarioEditandoUsername !== null"
            required
          />
          <input [(ngModel)]="usuarioForm.email" name="usuarioEmail" type="email" placeholder="Email" required />
          <input [(ngModel)]="usuarioForm.nombre" name="usuarioNombre" placeholder="Nombre" required />
          <input [(ngModel)]="usuarioForm.apellidos" name="usuarioApellidos" placeholder="Apellidos" />
          <input [(ngModel)]="usuarioForm.direccion" name="usuarioDireccion" placeholder="Direccion" />
          <input [(ngModel)]="usuarioForm.fechaRegistro" name="usuarioFechaRegistro" type="date" required />

          <select [(ngModel)]="usuarioForm.enabled" name="usuarioEnabled">
            <option [ngValue]="1">Activo</option>
            <option [ngValue]="0">Desactivado</option>
          </select>

          <select [(ngModel)]="usuarioForm.idPerfil" name="usuarioIdPerfil" required>
            <option [ngValue]="0">Selecciona perfil</option>
            <option *ngFor="let perfil of perfiles()" [ngValue]="perfil.idPerfil">{{ perfil.nombre }}</option>
          </select>

          <button type="submit">
            {{ usuarioEditandoUsername === null ? 'Crear usuario' : 'Guardar usuario' }}
          </button>
        </form>

        <div class="panel wide list-panel">
          <div>
            <h2>Usuarios</h2>
            <p class="block-helper">
              Tripulacion de AlienMilk: catadores, exploradores y operadores con acceso a la cabina.
            </p>
          </div>
          <div class="table-list">
            <article *ngFor="let usuario of usuarios()">
              <div>
                <strong>{{ usuario.username }}</strong>
                <p>{{ usuario.email }} · {{ usuario.perfil }} · {{ usuario.enabled ? 'activo' : 'inactivo' }}</p>
              </div>
              <div class="actions">
                <button type="button" class="ghost" (click)="editarUsuario(usuario)">Editar</button>
                <button type="button" class="danger" (click)="borrarUsuario(usuario.username)">Borrar</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="admin-grid" *ngIf="activeTab() === 'tipos'">
        <form class="panel small-panel" (ngSubmit)="guardarTipo()">
          <div class="block-header compact">
            <div>
              <h2>{{ tipoEditandoId === null ? 'Alta tipo' : 'Editar tipo' }}</h2>
              <p class="block-helper">Clasificacion de sesiones.</p>
            </div>
            <button *ngIf="tipoEditandoId !== null" type="button" class="ghost" (click)="cancelarEdicionTipo()">
              Nuevo
            </button>
          </div>

          <input [(ngModel)]="tipoForm.nombre" name="tipoNombre" placeholder="Nombre" required />
          <textarea
            [(ngModel)]="tipoForm.descripcion"
            name="tipoDescripcion"
            rows="3"
            placeholder="Descripcion"
          ></textarea>
          <button type="submit">{{ tipoEditandoId === null ? 'Crear tipo' : 'Guardar tipo' }}</button>
        </form>

        <div class="panel small-panel">
          <div>
            <h2>Tipos</h2>
            <p class="block-helper">Editar o eliminar tipos de evento.</p>
          </div>
          <div class="mini-list">
            <article *ngFor="let tipo of tipos()">
              <div>
                <strong>{{ tipo.nombre }}</strong>
                <p>{{ tipo.descripcion }}</p>
              </div>
              <div class="actions">
                <button type="button" class="ghost" (click)="editarTipo(tipo)">Editar</button>
                <button type="button" class="danger" (click)="borrarTipo(tipo.idTipo)">Borrar</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="admin-grid" *ngIf="activeTab() === 'perfiles'">
        <form class="panel small-panel" (ngSubmit)="guardarPerfil()">
          <div class="block-header compact">
            <div>
              <h2>{{ perfilEditandoId === null ? 'Alta perfil' : 'Editar perfil' }}</h2>
              <p class="block-helper">Roles disponibles para usuarios.</p>
            </div>
            <button
              *ngIf="perfilEditandoId !== null"
              type="button"
              class="ghost"
              (click)="cancelarEdicionPerfil()"
            >
              Nuevo
            </button>
          </div>

          <input [(ngModel)]="perfilForm.nombre" name="perfilNombre" placeholder="Nombre" required />
          <button type="submit">{{ perfilEditandoId === null ? 'Crear perfil' : 'Guardar perfil' }}</button>
        </form>

        <div class="panel small-panel">
          <div>
            <h2>Perfiles</h2>
            <p class="block-helper">Editar o eliminar perfiles.</p>
          </div>
          <div class="mini-list">
            <article *ngFor="let perfil of perfiles()">
              <strong>{{ perfil.nombre }}</strong>
              <div class="actions">
                <button type="button" class="ghost" (click)="editarPerfil(perfil)">Editar</button>
                <button type="button" class="danger" (click)="borrarPerfil(perfil.idPerfil)">Borrar</button>
              </div>
            </article>
          </div>
        </div>
      </section>

          <p class="feedback" *ngIf="feedback()">{{ feedback() }}</p>
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
      margin-top: 0.65rem;
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

    .sidebar nav button,
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
      transition:
        background 150ms ease,
        color 150ms ease,
        transform 150ms ease;
      border: 0;
    }

    .sidebar nav button:hover,
    .sidebar nav a:hover {
      background: #fef3c7;
      color: #d97706;
      transform: none;
      box-shadow: none;
    }

    .sidebar nav button.active,
    .sidebar nav a.active {
      background: linear-gradient(135deg, #d97706, #f59e0b);
      color: white;
    }

    .admin-content {
      display: grid;
      gap: 2rem;
      min-width: 0;
    }

    .admin-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 1rem;
    }

    .panel {
      grid-column: span 4;
      padding: 1.4rem;
      border-radius: 24px;
      background: #d2dae4;
      border: 1px solid rgba(71, 85, 105, 0.22);
      display: grid;
      gap: 0.9rem;
      align-content: start;
    }

    .wide {
      grid-column: span 8;
    }

    .form-panel,
    .small-panel {
      align-self: start;
    }

    .small-panel {
      grid-column: span 6;
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

    h1,
    h2,
    strong {
      font-family: 'Nunito', sans-serif;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.3rem, 4.4vw, 3.1rem);
      line-height: 1.02;
    }

    h2 {
      margin: 0;
    }

    .helper,
    .block-helper,
    .table-list p,
    .mini-list p {
      color: #64748b;
    }

    .helper {
      margin-top: 0.1rem;
      font-size: 1.06rem;
      line-height: 1.65;
    }

    .block-helper {
      margin: 0.25rem 0 0;
    }

    .summary-block {
      padding: 1.4rem;
      border-radius: 24px;
      background: #d2dae4;
      border: 1px solid rgba(71, 85, 105, 0.22);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
    }

    .stats div {
      padding: 1rem;
      border-radius: 18px;
      background: #f8fafc;
    }

    .stats span {
      display: block;
      font-size: 0.8rem;
      margin-bottom: 0.35rem;
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
    textarea,
    select {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      padding: 0.85rem 1rem;
      border-radius: 14px;
      border: 1px solid rgba(23, 32, 51, 0.12);
      font: inherit;
      background: white;
      box-sizing: border-box;
    }

    textarea {
      resize: vertical;
    }

    input:disabled {
      color: #64748b;
      background: #f8fafc;
    }

    button {
      border: 0;
      border-radius: 14px;
      padding: 0.85rem 1rem;
      font-family: 'Nunito', sans-serif;
      font-weight: 700;
      cursor: pointer;
      background: linear-gradient(135deg, #d97706, #f59e0b);
      color: white;
      transition:
        background-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
    }

    .ghost {
      background: #fef3c7;
      color: #d97706;
    }

    .danger {
      background: #fee2e2;
      color: #b91c1c;
    }

    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 22px rgba(23, 32, 51, 0.12);
    }

    .ghost:hover {
      background: #fde68a;
    }

    .danger:hover {
      background: #fecaca;
    }

    button:focus-visible {
      outline: 2px solid rgba(199, 104, 26, 0.35);
      outline-offset: 2px;
    }

    .table-list,
    .mini-list {
      display: grid;
      gap: 0.8rem;
    }

    .block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .compact {
      align-items: start;
    }

    .compact .ghost {
      padding: 0.65rem 0.8rem;
    }

    .table-list article,
    .mini-list article {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 0.95rem 1rem;
      border-radius: 18px;
      background: #f8fafc;
    }

    .mini-list article {
      align-items: flex-start;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .feedback {
      color: #166534;
      font-weight: 700;
    }

    @media (max-width: 1100px) {
      .panel,
      .wide,
      .small-panel {
        grid-column: 1 / -1;
      }

      .stats {
        grid-template-columns: repeat(2, 1fr);
      }
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

    @media (max-width: 760px) {
      .table-list article,
      .mini-list article,
      .block-header {
        flex-direction: column;
        align-items: stretch;
      }

      .actions {
        justify-content: flex-start;
      }
    }
  `,
})
export class AdminPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly eventos = signal<EventoListado[]>([]);
  readonly usuarios = signal<Usuario[]>([]);
  readonly tipos = signal<TipoEvento[]>([]);
  readonly perfiles = signal<Perfil[]>([]);
  readonly feedback = signal('');
  readonly activeTab = signal<'sesiones' | 'usuarios' | 'tipos' | 'perfiles'>('sesiones');

  setTab(tab: 'sesiones' | 'usuarios' | 'tipos' | 'perfiles'): void {
    this.activeTab.set(tab);
    this.feedback.set('');
  }

  eventoEditandoId: number | null = null;
  usuarioEditandoUsername: string | null = null;
  tipoEditandoId: number | null = null;
  perfilEditandoId: number | null = null;

  eventoForm: EventoPayload = this.nuevoEventoForm();
  usuarioForm: UsuarioPayload = this.nuevoUsuarioForm();
  tipoForm: TipoEventoPayload = this.nuevoTipoForm();
  perfilForm: PerfilPayload = this.nuevoPerfilForm();

  ngOnInit(): void {
    this.reloadAll();
  }

  guardarEvento(): void {
    if (!this.eventoForm.idTipo) {
      this.feedback.set('Selecciona un tipo de evento.');
      return;
    }

    const request =
      this.eventoEditandoId === null
        ? this.adminService.crearEvento(this.eventoForm)
        : this.adminService.actualizarEvento(this.eventoEditandoId, this.eventoForm);

    request.subscribe({
      next: () => {
        this.feedback.set(
          this.eventoEditandoId === null ? 'Sesion creada correctamente.' : 'Sesion actualizada correctamente.',
        );
        this.cancelarEdicionEvento();
        this.reloadAll();
      },
      error: (err) => this.mostrarError(err, 'No se ha podido guardar la sesion.'),
    });
  }

  editarEvento(idEvento: number): void {
    this.adminService.getEvento(idEvento).subscribe({
      next: (evento) => {
        this.eventoEditandoId = evento.idEvento;
        this.eventoForm = {
          nombre: evento.nombre,
          descripcion: evento.descripcion,
          fechaInicio: evento.fechaInicio,
          duracion: evento.duracion,
          direccion: evento.direccion,
          estado: evento.estado,
          aforoMaximo: evento.aforoMaximo,
          minimoAsistencia: evento.minimoAsistencia,
          precio: evento.precio,
          idTipo: evento.idTipo,
        };
        this.cdr.markForCheck();
      },
      error: (err) => this.mostrarError(err, 'No se ha podido cargar la sesion.'),
    });
  }

  cancelarEdicionEvento(): void {
    this.eventoEditandoId = null;
    this.eventoForm = this.nuevoEventoForm();
  }

  borrarEvento(idEvento: number): void {
    if (!confirm('¿Borrar esta sesion?')) {
      return;
    }

    this.adminService.borrarEvento(idEvento).subscribe({
      next: () => {
        this.feedback.set('Sesion borrada.');
        this.cancelarEdicionEvento();
        this.reloadAll();
      },
      error: (err) => this.mostrarError(err, 'No se ha podido borrar la sesion.'),
    });
  }

  guardarUsuario(): void {
    if (!this.usuarioForm.idPerfil) {
      this.feedback.set('Selecciona un perfil.');
      return;
    }

    const request =
      this.usuarioEditandoUsername === null
        ? this.adminService.crearUsuario(this.usuarioForm)
        : this.adminService.actualizarUsuario(this.usuarioEditandoUsername, this.usuarioForm);

    request.subscribe({
      next: () => {
        this.feedback.set(
          this.usuarioEditandoUsername === null
            ? 'Usuario creado correctamente.'
            : 'Usuario actualizado correctamente.',
        );
        this.cancelarEdicionUsuario();
        this.reloadAll();
      },
      error: (err) => this.mostrarError(err, 'No se ha podido guardar el usuario.'),
    });
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioEditandoUsername = usuario.username;
    this.usuarioForm = {
      username: usuario.username,
      password: '',
      email: usuario.email,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      direccion: usuario.direccion,
      enabled: usuario.enabled,
      fechaRegistro: usuario.fechaRegistro,
      idPerfil: usuario.idPerfil,
    };
  }

  cancelarEdicionUsuario(): void {
    this.usuarioEditandoUsername = null;
    this.usuarioForm = this.nuevoUsuarioForm();
  }

  borrarUsuario(username: string): void {
    if (!confirm(`¿Borrar el usuario ${username}?`)) {
      return;
    }

    this.adminService.borrarUsuario(username).subscribe({
      next: () => {
        this.feedback.set('Usuario borrado.');
        this.cancelarEdicionUsuario();
        this.reloadAll();
      },
      error: (err) => this.mostrarError(err, 'No se ha podido borrar el usuario.'),
    });
  }

  guardarTipo(): void {
    const request =
      this.tipoEditandoId === null
        ? this.adminService.crearTipo(this.tipoForm)
        : this.adminService.actualizarTipo(this.tipoEditandoId, this.tipoForm);

    request.subscribe({
      next: () => {
        this.feedback.set(this.tipoEditandoId === null ? 'Tipo creado correctamente.' : 'Tipo actualizado.');
        this.cancelarEdicionTipo();
        this.reloadAll();
      },
      error: (err) => this.mostrarError(err, 'No se ha podido guardar el tipo.'),
    });
  }

  editarTipo(tipo: TipoEvento): void {
    this.tipoEditandoId = tipo.idTipo;
    this.tipoForm = {
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
    };
  }

  cancelarEdicionTipo(): void {
    this.tipoEditandoId = null;
    this.tipoForm = this.nuevoTipoForm();
  }

  borrarTipo(idTipo: number): void {
    if (!confirm('¿Borrar este tipo de evento?')) {
      return;
    }

    this.adminService.borrarTipo(idTipo).subscribe({
      next: () => {
        this.feedback.set('Tipo borrado.');
        this.cancelarEdicionTipo();
        this.reloadAll();
      },
      error: (err) => this.mostrarError(err, 'No se ha podido borrar el tipo.'),
    });
  }

  guardarPerfil(): void {
    const request =
      this.perfilEditandoId === null
        ? this.adminService.crearPerfil(this.perfilForm)
        : this.adminService.actualizarPerfil(this.perfilEditandoId, this.perfilForm);

    request.subscribe({
      next: () => {
        this.feedback.set(
          this.perfilEditandoId === null ? 'Perfil creado correctamente.' : 'Perfil actualizado.',
        );
        this.cancelarEdicionPerfil();
        this.reloadAll();
      },
      error: (err) => this.mostrarError(err, 'No se ha podido guardar el perfil.'),
    });
  }

  editarPerfil(perfil: Perfil): void {
    this.perfilEditandoId = perfil.idPerfil;
    this.perfilForm = {
      nombre: perfil.nombre,
    };
  }

  cancelarEdicionPerfil(): void {
    this.perfilEditandoId = null;
    this.perfilForm = this.nuevoPerfilForm();
  }

  borrarPerfil(idPerfil: number): void {
    if (!confirm('¿Borrar este perfil?')) {
      return;
    }

    this.adminService.borrarPerfil(idPerfil).subscribe({
      next: () => {
        this.feedback.set('Perfil borrado.');
        this.cancelarEdicionPerfil();
        this.reloadAll();
      },
      error: (err) => this.mostrarError(err, 'No se ha podido borrar el perfil.'),
    });
  }

  private reloadAll(): void {
    this.adminService.getEventos().subscribe((data) => this.eventos.set(data));
    this.adminService.getUsuarios().subscribe((data) => this.usuarios.set(data));
    this.adminService.getTipos().subscribe((data) => {
      this.tipos.set(data);
      if (!this.eventoForm.idTipo && data.length) {
        this.eventoForm.idTipo = data[0].idTipo;
      }
    });
    this.adminService.getPerfiles().subscribe((data) => {
      this.perfiles.set(data);
      if (!this.usuarioForm.idPerfil && data.length) {
        this.usuarioForm.idPerfil = data[0].idPerfil;
      }
    });
  }

  private nuevoEventoForm(): EventoPayload {
    return {
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      duracion: 90,
      direccion: '',
      estado: 'ACTIVO',
      aforoMaximo: 50,
      minimoAsistencia: 10,
      precio: 20,
      idTipo: this.tipos()[0]?.idTipo ?? 0,
    };
  }

  private nuevoUsuarioForm(): UsuarioPayload {
    return {
      username: '',
      password: '',
      email: '',
      nombre: '',
      apellidos: '',
      direccion: '',
      enabled: 1,
      fechaRegistro: this.hoy(),
      idPerfil: this.perfiles()[0]?.idPerfil ?? 0,
    };
  }

  private nuevoTipoForm(): TipoEventoPayload {
    return {
      nombre: '',
      descripcion: '',
    };
  }

  private nuevoPerfilForm(): PerfilPayload {
    return {
      nombre: '',
    };
  }

  private hoy(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private mostrarError(err: unknown, fallback: string): void {
    const error = err as { error?: string | { message?: string; error?: string } };
    const message =
      typeof error.error === 'string' ? error.error : (error.error?.message ?? error.error?.error);
    this.feedback.set(message ?? fallback);
  }
}
