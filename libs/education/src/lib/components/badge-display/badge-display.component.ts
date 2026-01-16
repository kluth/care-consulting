import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Badge {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'education-badge-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="badge-grid">
      @for (badge of badges(); track badge.id) {
        <div class="badge-item" [title]="badge.description || badge.name">
          <div class="badge-icon">
            @if (badge.icon) {
              <img [src]="badge.icon" [alt]="badge.name" />
            } @else {
              <span>★</span>
            }
          </div>
          <span class="badge-name">{{ badge.name }}</span>
        </div>
      } @empty {
        <p class="empty-state">Noch keine Abzeichen</p>
      }
    </div>
  `,
  styles: [`
    .badge-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .badge-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
      text-align: center;
    }
    .badge-icon {
      width: 48px;
      height: 48px;
      background: #f0f4f8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .badge-name {
      font-size: 0.75rem;
      color: #4a5568;
    }
    .empty-state {
      color: #a0aec0;
      font-style: italic;
    }
  `]
})
export class BadgeDisplayComponent {
  badges = input<Badge[]>([]);
}
