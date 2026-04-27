import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  EventoDetalle,
  EventoListado,
  EventoPayload,
  Perfil,
  PerfilPayload,
  Reserva,
  TipoEvento,
  TipoEventoPayload,
  Usuario,
  UsuarioPayload,
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly adminUrl = `${environment.apiUrl}/admin`;

  getEventos(): Observable<EventoListado[]> {
    return this.http.get<EventoListado[]>(`${this.adminUrl}/eventos`);
  }

  getEvento(idEvento: number): Observable<EventoDetalle> {
    return this.http.get<EventoDetalle>(`${environment.apiUrl}/eventos/${idEvento}`);
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

  actualizarEvento(idEvento: number, payload: EventoPayload): Observable<EventoDetalle> {
    return this.http.put<EventoDetalle>(`${this.adminUrl}/eventos/${idEvento}`, payload);
  }

  cancelarEvento(idEvento: number): Observable<EventoDetalle> {
    return this.http.patch<EventoDetalle>(`${this.adminUrl}/eventos/${idEvento}/cancelar`, {});
  }

  borrarEvento(idEvento: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/eventos/${idEvento}`);
  }

  crearUsuario(payload: UsuarioPayload): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.adminUrl}/usuarios`, payload);
  }

  actualizarUsuario(username: string, payload: UsuarioPayload): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.adminUrl}/usuarios/${encodeURIComponent(username)}`, payload);
  }

  borrarUsuario(username: string): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/usuarios/${encodeURIComponent(username)}`);
  }

  crearTipo(payload: TipoEventoPayload): Observable<TipoEvento> {
    return this.http.post<TipoEvento>(`${this.adminUrl}/tipos-evento`, payload);
  }

  actualizarTipo(idTipo: number, payload: TipoEventoPayload): Observable<TipoEvento> {
    return this.http.put<TipoEvento>(`${this.adminUrl}/tipos-evento/${idTipo}`, payload);
  }

  borrarTipo(idTipo: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/tipos-evento/${idTipo}`);
  }

  crearPerfil(payload: PerfilPayload): Observable<Perfil> {
    return this.http.post<Perfil>(`${this.adminUrl}/perfiles`, payload);
  }

  actualizarPerfil(idPerfil: number, payload: PerfilPayload): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.adminUrl}/perfiles/${idPerfil}`, payload);
  }

  borrarPerfil(idPerfil: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/perfiles/${idPerfil}`);
  }

  getReservasUsuario(username: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.adminUrl}/reservas/usuario/${encodeURIComponent(username)}`);
  }

  crearReservaParaUsuario(
    username: string,
    idEvento: number,
    payload: { cantidad: number; observaciones: string },
  ): Observable<Reserva> {
    return this.http.post<Reserva>(
      `${this.adminUrl}/reservas/usuario/${encodeURIComponent(username)}/evento/${idEvento}`,
      payload,
    );
  }

  cancelarReservaAdmin(idReserva: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/reservas/${idReserva}`);
  }
}
