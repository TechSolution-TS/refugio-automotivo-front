import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servico } from '../../core/models/servico.model';
import { Cliente, Endereco } from '../../core/models/cliente.model';
import { SolicitacaoRequest } from '../../core/models/solicitacao.model';
import { ClienteService } from '../../core/services/cliente.service';
import { SolicitacaoService } from '../../core/services/solicitacao.service';

@Component({
  selector: 'app-service-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.css']
})
export class ServiceModalComponent implements OnInit {
  @Input() servico!: Servico;
  @Output() close = new EventEmitter<void>();
  @Output() solicitacaoSuccess = new EventEmitter<void>();

  formData = {
    cpf: '',
    nome: '',
    telefone: '',
    endereco: '',
    bairro: '',
    numero: '',
    complemento: ''
  };

  loading = false;
  searchingCliente = false;
  submitting = false;
  error: string | null = null;
  clienteEncontrado: Cliente | null = null;

  constructor(
    private clienteService: ClienteService,
    private solicitacaoService: SolicitacaoService
  ) {}

  ngOnInit(): void {
    // Previne scroll do body quando modal está aberto
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Restaura scroll do body
    document.body.style.overflow = '';
  }

  onClose(): void {
    this.close.emit();
  }

  getDestaques(): string[] {
    const destaquesCorrigidos = this.servico.destaques.replace(/\\n/g, '\n');
    
    return destaquesCorrigidos
      .split(/\r?\n/)
      .filter(d => d.trim())
      .map(d => d.replace(/^-\s*/, '').trim());
  }

  getTipo(): string {
    if (this.servico.nome.includes('SUV')) return 'SUV';
    if (this.servico.nome.includes('Caminhonete')) return 'Caminhonete';
    return '';
  }

  getNomeSimplificado(): string {
    return this.servico.nome.replace(/SUV|Caminhonete/g, '').trim();
  }

  onCpfBlur(): void {
    const cpfLimpo = this.formData.cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length === 11) {
      this.buscarCliente(cpfLimpo);
    }
  }

  buscarCliente(cpf: string): void {
    this.searchingCliente = true;
    this.clienteEncontrado = null;
    this.error = null;

    this.clienteService.getClienteByCpf(cpf).subscribe({
      next: (cliente) => {
        this.clienteEncontrado = cliente;
        this.preencherDadosCliente(cliente);
        this.searchingCliente = false;
      },
      error: (err) => {
        console.log('Cliente não encontrado, usando dados novos');
        this.searchingCliente = false;
      }
    });
  }

  preencherDadosCliente(cliente: Cliente): void {
    this.formData.nome = cliente.nome;
    this.formData.telefone = cliente.telefone;
    this.formData.endereco = cliente.endereco.endereco;
    this.formData.bairro = cliente.endereco.bairro;
    this.formData.numero = cliente.endereco.numero;
    this.formData.complemento = cliente.endereco.complemento || '';
  }

  onSubmit(): void {
    if (!this.validarFormulario()) {
      this.error = 'Por favor, preencha todos os campos obrigatórios';
      return;
    }

    this.submitting = true;
    this.error = null;

    const endereco: Endereco = {
      endereco: this.formData.endereco,
      bairro: this.formData.bairro,
      numero: this.formData.numero,
      complemento: this.formData.complemento || undefined
    };

    const solicitacao: SolicitacaoRequest = {
      usuario: {
        cpf: this.formData.cpf.replace(/\D/g, ''),
        nome: this.formData.nome,
        telefone: this.formData.telefone,
        endereco: endereco
      },
      endereco: endereco,
      servicoUuid: this.servico.uuid
    };

    this.solicitacaoService.criarSolicitacao(solicitacao).subscribe({
      next: (response) => {
        this.submitting = false;
        this.solicitacaoSuccess.emit();
      },
      error: (err) => {
        console.error('Erro ao criar solicitação:', err);
        this.error = 'Erro ao enviar solicitação. Tente novamente.';
        this.submitting = false;
      }
    });
  }

  validarFormulario(): boolean {
    const cpfLimpo = this.formData.cpf.replace(/\D/g, '');
    
    return !!(
      cpfLimpo.length === 11 &&
      this.formData.nome.trim() &&
      this.formData.telefone.trim() &&
      this.formData.endereco.trim() &&
      this.formData.bairro.trim() &&
      this.formData.numero.trim()
    );
  }

  // Máscaras para inputs
  onCpfInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substr(0, 11);
    
    if (value.length > 3) {
      value = value.substr(0, 3) + '.' + value.substr(3);
    }
    if (value.length > 7) {
      value = value.substr(0, 7) + '.' + value.substr(7);
    }
    if (value.length > 11) {
      value = value.substr(0, 11) + '-' + value.substr(11);
    }
    
    this.formData.cpf = value;
  }

  onTelefoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substr(0, 11);
    
    if (value.length > 2) {
      value = '(' + value.substr(0, 2) + ') ' + value.substr(2);
    }
    if (value.length > 10) {
      value = value.substr(0, 10) + '-' + value.substr(10);
    }
    
    this.formData.telefone = value;
  }
}