import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../core/models/cliente.model';

interface Recompensa {
  lavagens: number;
  descricao: string;
  icon: string;
  desconto: number | string;
  color: string;
}

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.css']
})
export class WelcomeModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() clienteFound = new EventEmitter<Cliente>();

  cpf: string = '';
  searching: boolean = false;
  showResults: boolean = false;
  cliente: Cliente | null = null;
  error: string | null = null;

  recompensas: Recompensa[] = [
    { lavagens: 2, descricao: '10% de desconto', icon: 'tag', desconto: 10, color: '#60a5fa' },
    { lavagens: 5, descricao: '50% de desconto', icon: 'star', desconto: 50, color: '#f59e0b' },
    { lavagens: 7, descricao: 'Presente surpresa', icon: 'gift', desconto: '🎁', color: '#ec4899' },
    { lavagens: 10, descricao: 'Lavagem grátis', icon: 'trophy', desconto: 'FREE', color: '#10b981' }
  ];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  onClose(): void {
    this.close.emit();
  }

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
    
    this.cpf = value;
  }

  buscarDesconto(): void {
    const cpfLimpo = this.cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
      this.error = 'Por favor, digite um CPF válido';
      return;
    }

    this.searching = true;
    this.error = null;

    this.clienteService.getClienteByCpf(cpfLimpo).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.showResults = true;
        this.searching = false;
        this.clienteFound.emit(cliente);
      },
      error: (err) => {
        // Cliente novo - mostra mensagem de boas-vindas
        this.cliente = null;
        this.showResults = true;
        this.searching = false;
      }
    });
  }

  getProximaRecompensa(): Recompensa | null {
    if (!this.cliente) return this.recompensas[0];
    
    const total = this.cliente.totalSolicitacoes || 0;
    return this.recompensas.find(r => r.lavagens > total) || null;
  }

  getRecompensaAtual(): Recompensa | null {
    if (!this.cliente) return null;
    
    const total = this.cliente.totalSolicitacoes || 0;
    const recompensasAlcancadas = this.recompensas.filter(r => r.lavagens == (total + 1));
    
    if (recompensasAlcancadas[0] != null) {
      sessionStorage.setItem('recompensaAtual', JSON.stringify(recompensasAlcancadas[0].descricao));
    } 

    return recompensasAlcancadas[0] || null;
  }

  getLavagensFaltantes(): number {
    const proxima = this.getProximaRecompensa();
    if (!proxima || !this.cliente) return 0;
    
    const total = this.cliente.totalSolicitacoes || 0;
    return proxima.lavagens - total;
  }

  getProgresso(): number {
    if (!this.cliente) return 0;
    
    const total = this.cliente.totalSolicitacoes || 0;
    const maxLavagens = 10;
    return (total / maxLavagens) * 100;
  }

  continuar(): void {
    this.onClose();
  }
}