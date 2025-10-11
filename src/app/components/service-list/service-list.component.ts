import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servico } from '../../core/models/servico.model';
import { ServicoService } from '../../core/services/servico.service';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { ServiceModalComponent } from '../service-modal/service-modal.component';
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal.component';
import { SuccessModalComponent } from '../success-modal/success-modal.component';


@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, ServiceModalComponent, WelcomeModalComponent, SuccessModalComponent],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  servicosLimpeza: Servico[] = [];
  servicosManutencao: Servico[] = [];
  selectedServico: Servico | null = null;
  loading = false;
  error: string | null = null;
  activeTab: 'limpeza' | 'manutencao' = 'limpeza';
  showWelcomeModal = true;
  showSuccessModal = false; 

  private limpezaLoaded = false;
  private manutencaoLoaded = false;

  constructor(private servicoService: ServicoService) {}

  ngOnInit(): void {
    this.loadServicosPorTab(this.activeTab);
  }

  loadServicosPorTab(tipo: 'limpeza' | 'manutencao'): void {
    if (tipo === 'limpeza' && this.limpezaLoaded) return;
    if (tipo === 'manutencao' && this.manutencaoLoaded) return;

    this.loading = true;
    this.error = null;

    this.servicoService.getServicosPorTipo(tipo).subscribe({
      next: (data) => {
        if (tipo === 'limpeza') {
          this.servicosLimpeza = data;
          this.limpezaLoaded = true;
        } else {
          this.servicosManutencao = data;
          this.manutencaoLoaded = true;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(`Erro ao carregar serviços de ${tipo}:`, err);
        this.error = `Erro ao carregar serviços de ${tipo}. Tente novamente.`;
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: 'limpeza' | 'manutencao'): void {
    this.activeTab = tab;
    this.loadServicosPorTab(tab);
  }

  onServiceClick(servico: Servico): void {
    this.selectedServico = servico;
  }

  onCloseModal(): void {
    this.selectedServico = null;
  }

  onSolicitacaoSuccess(): void {
    this.selectedServico = null;
    this.showSuccessModal = true
  }

  onCloseSuccessModal(): void {
    this.showSuccessModal = false;
  }

  onCloseWelcomeModal(): void {
    this.showWelcomeModal = false;
  }

  onClienteFound(cliente: any): void {
    console.log('Cliente encontrado:', cliente);
  }
}