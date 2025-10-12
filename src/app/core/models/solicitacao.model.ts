import { Endereco } from "./cliente.model";

export interface SolicitacaoRequest {
    usuario: {
      cpf: string;
      nome: string;
      telefone: string;
      endereco: Endereco;
    };
    endereco: Endereco;
    servicoUuid: string;
    premiacao: string
}