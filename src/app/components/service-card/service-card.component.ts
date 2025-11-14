import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servico } from '../../core/models/servico.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent implements OnInit {
  @Input() servico!: Servico;
  @Input() manutencao!: boolean;

  backgroundImage: string = '';

  images = [
    '/assets/images/car-1.png',
    '/assets/images/car-2.png',
    '/assets/images/car-3.png',
    '/assets/images/car-4.png'
  ];

  // Array estático para rastrear imagens usadas
  private static usedImages: Set<string> = new Set();
  private static availableImages: string[] = [];

  ngOnInit(): void {
    if (this.manutencao) {
      this.backgroundImage = this.getImageRevision();
    } else {
      this.backgroundImage = this.getUniqueImage();
    }
  }

  getUniqueImage(): string {
    if (ServiceCardComponent.usedImages.size === this.images.length) {
      ServiceCardComponent.usedImages.clear();
      ServiceCardComponent.availableImages = [...this.images];
    }

    if (ServiceCardComponent.availableImages.length === 0) {
      ServiceCardComponent.availableImages = [...this.images];
    }

    if (this.servico.nome.includes('Moto')) {
      return '/assets/images/rev-mot.png';
    }

    const randomIndex = Math.floor(Math.random() * ServiceCardComponent.availableImages.length);
    const selectedImage = ServiceCardComponent.availableImages[randomIndex];

    ServiceCardComponent.availableImages.splice(randomIndex, 1);
    ServiceCardComponent.usedImages.add(selectedImage);

    return selectedImage;
  }

  getImageRevision(): string {
    let type = this.getTipo();
    return type == 'Carro' ? '/assets/images/rev-car.png' : '/assets/images/rev-mot.png';
  }

  getIconType(): string {
    return this.servico.nome.includes('Completa') ? 'sparkles' : 'droplets';
  }

  getTipo(): string {
    if (this.servico.nome.includes('SUV')) return 'SUV';
    if (this.servico.nome.includes('Caminhonete')) return 'Caminhonete';
    if (this.servico.nome.includes('Aplicativo / Taxi')) return 'Aplicativo / Taxi';
    if (this.servico.nome.includes('Sedan / Hatch')) return 'Aplicativo / Taxi';
    if (this.servico.nome.includes('Carro')) return 'Carro';
    if (this.servico.nome.includes('Moto')) return 'Moto';
    return '';
  }

  getNomeSimplificado(): string {
    return this.servico.nome.replace(/SUV|Caminhonete|Sedan|Hatch|Aplicativo|Taxi|Moto/g, '').trim();
  }
}