import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="'btn btn-' + variant() + ' btn-' + size()"
      [disabled]="disabled() || loading()"
    >
      @if (loading()) {
        <span class="spinner">↻</span>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      padding: 0.5rem 1rem;
      border: 1px solid transparent;
      border-radius: 0.25rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-primary { background: var(--color-primary, blue); color: white; }
    .btn-secondary { background: var(--color-secondary, gray); color: white; }
    .spinner { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class UiButtonComponent {
  variant = input<'primary' | 'secondary' | 'outline'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
}
