import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EventoDetalle, EventoListado, EventoPayload, Perfil, TipoEvento, Usuario } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly adminUrl = 'http://localhost:8081/api/admin';

  getEventos(): Observable<EventoListado[]> {
    return this.http.get<EventoListado[]>(`${this.adminUrl}/eventos`);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.adminUrl}/usuarios`);
  }

  getTipos(): Observable<TipoEvento[]> {
    return this.http.get<TipoEvento[]>(`${this.adminUrl}/tipos-evento`);
  }

  getPerfiles(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(`${this.adminUrl}/perfiles`);
  }

  crearEvento(payload: EventoPayload): Observable<EventoDetalle> {
    return this.http.post<EventoDetalle>(`${this.adminUrl}/eventos`, payload);
  }

  cancelarEvento(idEvento: number): Observable<EventoDetalle> {
    return this.http.patch<EventoDetalle>(`${this.adminUrl}/eventos/${idEvento}/cancelar`, {});
  }

  destacarEvento(idEvento: number, valor: 'S' | 'N'): Observable<EventoDetalle> {
    return this.http.patch<EventoDetalle>(`${this.adminUrl}/eventos/${idEvento}/destacado/${valor}`, {});
  }
}
