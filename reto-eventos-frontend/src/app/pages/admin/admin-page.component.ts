import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../core/services/admin.service';
import { EventoListado, EventoPayload, Perfil, TipoEvento, Usuario } from '../../models/api.models';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe],
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
            Revisa sesiones, usuarios, tipos y perfiles desde la cabina central del laboratorio.
          </p>
        </div>
      </div>

      <section class="panel-block summary-block">
        <div class="stats">
          <div><span>Eventos</span><strong>{{ eventos().length }}</strong></div>
          <div><span>Usuarios</span><strong>{{ usuarios().length }}</strong></div>
          <div><span>Tipos</span><strong>{{ tipos().length }}</strong></div>
          <div><span>Perfiles</span><strong>{{ perfiles().length }}</strong></div>
        </div>
      </section>

      <section class="admin-grid">
        <form class="panel form-panel" (ngSubmit)="crearEvento()">
          <div>
            <h2>Alta de sesion</h2>
            <p class="block-helper">Crea nuevas experiencias con el formato minimo del reto.</p>
          </div>

          <input [(ngModel)]="form.nombre" name="nombre" placeholder="Nombre" required />
          <textarea [(ngModel)]="form.descripcion" name="descripcion" rows="3" placeholder="Descripción"></textarea>
          <input [(ngModel)]="form.fechaInicio" name="fechaInicio" type="date" required />
          <input [(ngModel)]="form.direccion" name="direccion" placeholder="Dirección" required />
          <input [(ngModel)]="form.duracion" name="duracion" type="number" placeholder="Duración" required />
          <input [(ngModel)]="form.aforoMaximo" name="aforoMaximo" type="number" placeholder="Aforo máximo" required />
          <input [(ngModel)]="form.minimoAsistencia" name="minimoAsistencia" type="number" placeholder="Mínimo asistencia" required />
          <input [(ngModel)]="form.precio" name="precio" type="number" step="0.01" placeholder="Precio" required />

          <select [(ngModel)]="form.idTipo" name="idTipo" required>
            <option [ngValue]="0">Selecciona tipo</option>
            <option *ngFor="let tipo of tipos()" [ngValue]="tipo.idTipo">{{ tipo.nombre }}</option>
          </select>

          <select [(ngModel)]="form.destacado" name="destacado">
            <option value="N">No destacado</option>
            <option value="S">Destacado</option>
          </select>

          <button type="submit">Crear sesion</button>
        </form>

        <div class="panel wide list-panel">
          <div class="block-header">
            <div>
              <h2>Sesiones</h2>
              <p class="block-helper">Gestiona las sesiones activas, destacadas o canceladas.</p>
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
                <button type="button" class="ghost" (click)="toggleDestacado(evento)">
                  {{ evento.destacado === 'S' ? 'Quitar destacado' : 'Destacar' }}
                </button>
                <button type="button" class="danger" (click)="cancelar(evento.idEvento)">Cancelar sesion</button>
              </div>
            </article>
          </div>
        </div>

        <div class="panel small-panel">
          <div>
            <h2>Usuarios</h2>
            <p class="block-helper">Listado rapido de acceso y perfil.</p>
          </div>
          <ul class="simple-list">
            <li *ngFor="let usuario of usuarios()">{{ usuario.username }} · {{ usuario.perfil }}</li>
          </ul>
        </div>

        <div class="panel small-panel">
          <div>
            <h2>Tipos y perfiles</h2>
            <p class="block-helper">Base simple para clasificar sesiones y usuarios.</p>
          </div>
          <ul class="simple-list">
            <li *ngFor="let tipo of tipos()">{{ tipo.nombre }}</li>
            <li *ngFor="let perfil of perfiles()">{{ perfil.nombre }}</li>
          </ul>
        </div>
      </section>

      <p class="feedback" *ngIf="feedback()">{{ feedback() }}</p>
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
    }

    .wide {
      grid-column: span 8;
    }

    .form-panel {
      align-self: start;
    }

    .small-panel {
      align-self: start;
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
    .simple-list {
      color: #64748b;
    }

    .helper {
      margin-top: 0.1rem;
      font-size: 1.06rem;
      line-height: 1.65;
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

    input,
    textarea,
    select {
      padding: 0.85rem 1rem;
      border-radius: 14px;
      border: 1px solid rgba(23, 32, 51, 0.12);
      font: inherit;
      background: white;
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

    .table-list {
      display: grid;
      gap: 0.8rem;
    }

    .block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .table-list article {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 0.95rem 1rem;
      border-radius: 18px;
      background: #f8fafc;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .simple-list {
      padding-left: 1rem;
      margin: 0;
    }

    .feedback {
      color: #166534;
      font-weight: 700;
    }

    @media (max-width: 1100px) {
      .panel,
      .wide {
        grid-column: 1 / -1;
      }

      .stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 760px) {
      .table-list article {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `,
})
export class AdminPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly eventos = signal<EventoListado[]>([]);
  readonly usuarios = signal<Usuario[]>([]);
  readonly tipos = signal<TipoEvento[]>([]);
  readonly perfiles = signal<Perfil[]>([]);
  readonly feedback = signal('');

  form: EventoPayload = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    duracion: 90,
    direccion: '',
    estado: 'ACTIVO',
    destacado: 'N',
    aforoMaximo: 50,
    minimoAsistencia: 10,
    precio: 20,
    idTipo: 0,
  };

  ngOnInit(): void {
    this.reloadAll();
  }

  crearEvento(): void {
    this.adminService.crearEvento(this.form).subscribe({
      next: () => {
        this.feedback.set('Sesion creada correctamente.');
        this.form = {
          nombre: '',
          descripcion: '',
          fechaInicio: '',
          duracion: 90,
          direccion: '',
          estado: 'ACTIVO',
          destacado: 'N',
          aforoMaximo: 50,
          minimoAsistencia: 10,
          precio: 20,
          idTipo: this.tipos()[0]?.idTipo ?? 0,
        };
        this.reloadAll();
      },
      error: (err) => {
        this.feedback.set(err?.error?.message ?? 'No se ha podido crear la sesion.');
      },
    });
  }

  cancelar(idEvento: number): void {
    this.adminService.cancelarEvento(idEvento).subscribe({
      next: () => {
        this.feedback.set('Sesion cancelada.');
        this.reloadAll();
      },
      error: (err) => this.feedback.set(err?.error?.message ?? 'No se ha podido cancelar la sesion.'),
    });
  }

  toggleDestacado(evento: EventoListado): void {
    const nuevoValor = evento.destacado === 'S' ? 'N' : 'S';
    this.adminService.destacarEvento(evento.idEvento, nuevoValor).subscribe({
      next: () => {
        this.feedback.set('Estado de destacado actualizado.');
        this.reloadAll();
      },
      error: (err) => this.feedback.set(err?.error?.message ?? 'No se ha podido actualizar el destacado.'),
    });
  }

  private reloadAll(): void {
    this.adminService.getEventos().subscribe((data) => this.eventos.set(data));
    this.adminService.getUsuarios().subscribe((data) => this.usuarios.set(data));
    this.adminService.getTipos().subscribe((data) => {
      this.tipos.set(data);
      if (!this.form.idTipo && data.length) {
        this.form.idTipo = data[0].idTipo;
      }
    });
    this.adminService.getPerfiles().subscribe((data) => this.perfiles.set(data));
  }
}
