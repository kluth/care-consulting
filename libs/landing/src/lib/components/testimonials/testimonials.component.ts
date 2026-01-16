import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialsContent } from '../../models/content.model';

@Component({
  selector: 'landing-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (content() && content()!.testimonials.length > 0) {
      <section class="testimonials" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title" data-testid="testimonials-title">
          {{ content()?.sectionTitle }}
        </h2>

        <div data-testid="testimonials-container" class="testimonials__container" aria-live="polite">
          @if (currentTestimonial()) {
            <blockquote data-testid="testimonial-quote" class="testimonial__quote">
              "{{ currentTestimonial()?.quote }}"
            </blockquote>

            <div class="testimonial__author">
              @if (currentTestimonial()?.avatar) {
                <img
                  data-testid="testimonial-avatar"
                  [src]="currentTestimonial()?.avatar"
                  [alt]="currentTestimonial()?.author + ' Foto'"
                  class="testimonial__avatar"
                />
              }
              <div class="testimonial__info">
                <cite data-testid="testimonial-author">{{ currentTestimonial()?.author }}</cite>
                <span data-testid="testimonial-role">{{ currentTestimonial()?.role }}</span>
                @if (currentTestimonial()?.company) {
                  <span data-testid="testimonial-company">{{ currentTestimonial()?.company }}</span>
                }
              </div>
            </div>
          }
        </div>

        @if (content()!.testimonials.length > 1) {
          <div class="testimonials__nav">
            <button
              data-testid="testimonial-prev"
              class="testimonials__nav-btn"
              type="button"
              aria-label="Vorheriges Testimonial"
              (click)="previous()"
            >
              ←
            </button>

            <div class="testimonials__indicators">
              @for (testimonial of content()?.testimonials; track testimonial.id; let i = $index) {
                <button
                  data-testid="testimonial-indicator"
                  class="testimonials__indicator"
                  [class.active]="i === activeIndex()"
                  type="button"
                  [attr.aria-label]="'Testimonial ' + (i + 1)"
                  (click)="goTo(i)"
                ></button>
              }
            </div>

            <button
              data-testid="testimonial-next"
              class="testimonials__nav-btn"
              type="button"
              aria-label="Nächstes Testimonial"
              (click)="next()"
            >
              →
            </button>
          </div>
        }
      </section>
    }
  `,
  styles: [`
    .testimonials {
      padding: 4rem 2rem;
      text-align: center;
      background-color: var(--color-primary, #1a365d);
      color: white;
    }

    h2 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      margin-bottom: 3rem;
    }

    .testimonials__container {
      max-width: 700px;
      margin: 0 auto 2rem;
    }

    .testimonial__quote {
      font-size: clamp(1.125rem, 2.5vw, 1.5rem);
      font-style: italic;
      line-height: 1.6;
      margin: 0 0 2rem;
      padding: 0;
      border: none;
    }

    .testimonial__author {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .testimonial__avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid white;
    }

    .testimonial__info {
      text-align: left;
      display: flex;
      flex-direction: column;
    }

    .testimonial__info cite {
      font-style: normal;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .testimonial__info span {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .testimonials__nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .testimonials__nav-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid white;
      background: transparent;
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .testimonials__nav-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .testimonials__nav-btn:focus-visible {
      outline: 3px solid white;
      outline-offset: 2px;
    }

    .testimonials__indicators {
      display: flex;
      gap: 0.5rem;
    }

    .testimonials__indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: none;
      background-color: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .testimonials__indicator.active {
      background-color: white;
    }

    .testimonials__indicator:hover {
      background-color: rgba(255, 255, 255, 0.6);
    }
  `],
})
export class TestimonialsComponent {
  content = input<TestimonialsContent>();
  activeIndex = signal(0);

  currentTestimonial = computed(() => {
    const testimonials = this.content()?.testimonials;
    if (!testimonials || testimonials.length === 0) return null;
    return testimonials[this.activeIndex()];
  });

  next(): void {
    const testimonials = this.content()?.testimonials;
    if (!testimonials) return;
    const nextIndex = (this.activeIndex() + 1) % testimonials.length;
    this.activeIndex.set(nextIndex);
  }

  previous(): void {
    const testimonials = this.content()?.testimonials;
    if (!testimonials) return;
    const prevIndex = this.activeIndex() === 0 ? testimonials.length - 1 : this.activeIndex() - 1;
    this.activeIndex.set(prevIndex);
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
  }
}
