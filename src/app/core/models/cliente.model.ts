export interface Endereco {
    endereco: string;
    bairro: string;
    numero: string;
    complemento?: string;
}
  
export interface Cliente {
    usuarioUuid?: string;
    cpf: string;
    nome: string;
    telefone: string;
    enderecoUuid?: string;
    endereco: Endereco;
    totalSolicitacoes?: number;
}