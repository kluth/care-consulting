import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'education-level-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="level-container">
      <div class="level-badge">
        <span>Level</span>
        <strong>{{ level() }}</strong>
      </div>
      <div class="progress-section">
        <div class="xp-info">
          <span>{{ currentXp() }} XP</span>
          <span>{{ nextLevelXp() }} XP</span>
        </div>
        <div class="progress-bar-bg">
          <div 
            class="progress-bar-fill" 
            [style.width.%]="progressPercentage()"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .level-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .level-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--color-primary, #1a365d);
      color: white;
      padding: 0.5rem;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      justify-content: center;
    }
    .progress-section {
      flex: 1;
    }
    .xp-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #718096;
      margin-bottom: 0.25rem;
    }
    .progress-bar-bg {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: #48bb78;
      transition: width 0.5s ease;
    }
  `]
})
export class LevelProgressComponent {
  level = input.required<number>();
  currentXp = input.required<number>();
  nextLevelXp = input.required<number>();

  progressPercentage = computed(() => {
    const total = this.nextLevelXp();
    const current = this.currentXp();
    if (total === 0) return 100;
    return Math.min(100, Math.max(0, (current / total) * 100));
  });
}
