import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SolicitacaoRequest } from '../models/solicitacao.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private apiUrl = `/api/solicitacoes`;

  constructor(private http: HttpClient) {}

  criarSolicitacao(solicitacao: SolicitacaoRequest): Observable<any> {
    return this.http.post(this.apiUrl, solicitacao);
  }
}