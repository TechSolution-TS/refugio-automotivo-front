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

  selectedFilter: string = 'todos';
  availableFilters: string[] = ['todos'];

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
          this.updateAvailableFilters();
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
    this.selectedFilter = 'todos';
    this.loadServicosPorTab(tab);
  }


  updateAvailableFilters(): void {
    const tiposSet = new Set<string>();
    tiposSet.add('todos');
    
    this.servicosLimpeza.forEach(servico => {
      const tipo = this.getTipoServico(servico);
      if (tipo) {
        tiposSet.add(tipo);
      }
    });

    this.availableFilters = Array.from(tiposSet);
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  getFilteredServicos(): Servico[] {
    if (this.selectedFilter === 'todos') {
      return this.servicosLimpeza;
    }

    return this.servicosLimpeza.filter(servico => {
      const tipo = this.getTipoServico(servico);
      return tipo === this.selectedFilter;
    });
  }

  getTipoServico(servico: Servico): string {
    if (servico.nome.includes('SUV')) return 'SUV';
    if (servico.nome.includes('Caminhonete')) return 'Caminhonete';
    if (servico.nome.includes('Aplicativo  Taxi')) return 'Aplicativo / Taxi';
    if (servico.nome.includes('Sedan  Hatch')) return 'Sedan / Hatch';
    if (servico.nome.includes('Carro')) return 'Carro';
    if (servico.nome.includes('Moto')) return 'Moto';
    return '';
  }

  getServicosCount(filter: string): number {
    if (filter === 'todos') {
      return this.servicosLimpeza.length;
    }
    return this.servicosLimpeza.filter(s => this.getTipoServico(s) === filter).length;
  }

  onServiceClick(servico: Servico): void {
    this.selectedServico = servico;
  }

  onCloseModal(): void {
    this.selectedServico = null;
  }

  onSolicitacaoSuccess(): void {
    this.selectedServico = null;
    this.showSuccessModal = true;
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