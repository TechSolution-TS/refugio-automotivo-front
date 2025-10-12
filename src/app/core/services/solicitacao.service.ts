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
    const recompensaStr = sessionStorage.getItem('recompensaAtual');

    if (recompensaStr) {
      console.log(recompensaStr);
      solicitacao.premiacao = recompensaStr;
      sessionStorage.removeItem('recompensaAtual');
    }

    return this.http.post(this.apiUrl, solicitacao);
  }
}