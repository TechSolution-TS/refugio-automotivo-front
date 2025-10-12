import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Servico } from '../models/servico.model';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private apiUrl = `/api/servicos`; 

  constructor(private http: HttpClient) {}

  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  getServicosPorTipo(tipo: 'limpeza' | 'manutencao'): Observable<Servico[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<Servico[]>(this.apiUrl, { params });
  }
}