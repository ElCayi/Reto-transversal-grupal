import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EventoDetalle, EventoListado } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8081/api/eventos';

  getActivos(): Observable<EventoListado[]> {
    return this.http.get<EventoListado[]>(`${this.apiUrl}/activos`);
  }

  getDestacados(): Observable<EventoListado[]> {
    return this.http.get<EventoListado[]>(`${this.apiUrl}/destacados`);
  }

  getCancelados(): Observable<EventoListado[]> {
    return this.http.get<EventoListado[]>(`${this.apiUrl}/cancelados`);
  }

  getTerminados(): Observable<EventoListado[]> {
    return this.http.get<EventoListado[]>(`${this.apiUrl}/terminados`);
  }

  getDetalle(idEvento: number): Observable<EventoDetalle> {
    return this.http.get<EventoDetalle>(`${this.apiUrl}/${idEvento}`);
  }
}
