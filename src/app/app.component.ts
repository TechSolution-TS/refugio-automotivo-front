import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './components/service-list/service-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ServiceListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Clean Car';
}