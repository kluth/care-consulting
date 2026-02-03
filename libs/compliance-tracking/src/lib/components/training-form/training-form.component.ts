import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { EducationTrackingService } from '../../services/education-tracking.service';
import {
  CreateEntryDto,
  EducationCategory,
  CATEGORY_I18N_KEYS,
  EducationEntry,
} from '../../models/education-tracking.model';

@Component({
  selector: 'cc-training-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="training-form"
      *transloco="let t; prefix: 'education'"
      [attr.aria-label]="t('form.addExternal')"
    >
      <h3 class="form-title">{{ t('form.addExternal') }}</h3>

      <!-- Title -->
      <div class="form-group">
        <label for="title">{{ t('form.title') }} *</label>
        <input
          id="title"
          type="text"
          formControlName="title"
          [placeholder]="t('form.titlePlaceholder')"
          [attr.aria-invalid]="isFieldInvalid('title')"
          [attr.aria-describedby]="
            isFieldInvalid('title') ? 'title-error' : null
          "
        />
        @if (isFieldInvalid('title')) {
          <span id="title-error" class="error-message" role="alert">
            {{ t('form.titleRequired') }}
          </span>
        }
      </div>

      <!-- Provider -->
      <div class="form-group">
        <label for="provider">{{ t('form.provider') }}</label>
        <input
          id="provider"
          type="text"
          formControlName="provider"
          [placeholder]="t('form.providerPlaceholder')"
        />
      </div>

      <!-- Date -->
      <div class="form-group">
        <label for="trainingDate">{{ t('form.date') }} *</label>
        <input
          id="trainingDate"
          type="date"
          formControlName="trainingDate"
          [max]="today"
          [attr.aria-invalid]="isFieldInvalid('trainingDate')"
          [attr.aria-describedby]="
            isFieldInvalid('trainingDate') ? 'date-error' : null
          "
        />
        @if (isFieldInvalid('trainingDate')) {
          <span id="date-error" class="error-message" role="alert">
            @if (form.get('trainingDate')?.errors?.['required']) {
              {{ t('form.dateRequired') }}
            } @else if (form.get('trainingDate')?.errors?.['futureDate']) {
              {{ t('form.dateFuture') }}
            }
          </span>
        }
      </div>

      <!-- Hours -->
      <div class="form-group">
        <label for="hours">{{ t('form.hours') }} *</label>
        <input
          id="hours"
          type="number"
          formControlName="hours"
          min="0.5"
          max="40"
          step="0.5"
          [placeholder]="t('form.hoursPlaceholder')"
          [attr.aria-invalid]="isFieldInvalid('hours')"
          [attr.aria-describedby]="
            isFieldInvalid('hours') ? 'hours-error' : null
          "
        />
        @if (isFieldInvalid('hours')) {
          <span id="hours-error" class="error-message" role="alert">
            {{ t('form.hoursRequired') }}
          </span>
        }
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="category">{{ t('form.category') }} *</label>
        <select
          id="category"
          formControlName="category"
          [attr.aria-invalid]="isFieldInvalid('category')"
        >
          @for (cat of categories; track cat.value) {
            <option [value]="cat.value">{{ t(cat.i18nKey) }}</option>
          }
        </select>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="description">{{ t('form.description') }}</label>
        <textarea
          id="description"
          formControlName="description"
          rows="3"
          [placeholder]="t('form.descriptionPlaceholder')"
        ></textarea>
      </div>

      <!-- Document Upload -->
      <div class="form-group">
        <label for="document">{{ t('form.document') }}</label>
        <div class="file-upload">
          <input
            id="document"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            (change)="onFileSelect($event)"
            class="file-input"
          />
          <span class="file-label">
            @if (selectedFileName()) {
              {{ selectedFileName() }}
            } @else {
              {{ t('form.documentUpload') }}
            }
          </span>
        </div>
        <span class="hint">{{ t('form.documentHint') }}</span>
      </div>

      <!-- Submit -->
      <div class="form-actions">
        <button
          type="submit"
          [disabled]="form.invalid || submitting()"
          class="submit-btn"
        >
          @if (submitting()) {
            <span class="spinner" aria-hidden="true"></span>
            {{ t('form.saving') }}
          } @else {
            {{ t('form.save') }}
          }
        </button>
      </div>

      <!-- Success message -->
      @if (success()) {
        <div class="success-message" role="status" aria-live="polite">
          {{ t('form.success') }}
        </div>
      }

      <!-- Error message -->
      @if (submitError()) {
        <div class="error-banner" role="alert">
          {{ submitError() }}
        </div>
      }
    </form>
  `,
  styles: `
    .training-form {
      background: var(--cc-surface, #fff);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--cc-border, #e5e7eb);
    }

    .form-title {
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--cc-text, #111827);
    }

    .form-group {
      margin-bottom: 1.25rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--cc-text, #111827);
      }

      input,
      select,
      textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--cc-border, #d1d5db);
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:focus {
          outline: none;
          border-color: var(--cc-primary, #3b82f6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        &[aria-invalid='true'] {
          border-color: var(--cc-error, #ef4444);

          &:focus {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
          }
        }
      }

      textarea {
        resize: vertical;
        min-height: 80px;
      }

      select {
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.75rem center;
        background-repeat: no-repeat;
        background-size: 1.25em 1.25em;
        appearance: none;
        padding-right: 2.5rem;
      }
    }

    .error-message {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--cc-error, #ef4444);
    }

    .hint {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: var(--cc-text-muted, #6b7280);
    }

    .file-upload {
      position: relative;
      border: 2px dashed var(--cc-border, #d1d5db);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s;

      &:hover {
        border-color: var(--cc-primary, #3b82f6);
      }

      .file-input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }

      .file-label {
        color: var(--cc-text-muted, #6b7280);
        font-size: 0.875rem;
      }
    }

    .form-actions {
      margin-top: 1.5rem;
    }

    .submit-btn {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: var(--cc-primary, #3b82f6);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: background 0.2s;

      &:hover:not(:disabled) {
        background: var(--cc-primary-dark, #2563eb);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    .success-message {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: var(--cc-success-bg, #d1fae5);
      color: var(--cc-success, #059669);
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
    }

    .error-banner {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: var(--cc-error-bg, #fee2e2);
      color: var(--cc-error, #dc2626);
      border-radius: 8px;
      text-align: center;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class TrainingFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly educationService = inject(EducationTrackingService);

  // Outputs
  readonly entryCreated = output<EducationEntry>();

  // State
  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly selectedFileName = signal<string | null>(null);

  // Today's date for max validation
  readonly today = new Date().toISOString().split('T')[0];

  // Category options with i18n keys
  readonly categories: { value: EducationCategory; i18nKey: string }[] = [
    { value: 'FACHLICH', i18nKey: CATEGORY_I18N_KEYS['FACHLICH'] },
    { value: 'PAEDAGOGISCH', i18nKey: CATEGORY_I18N_KEYS['PAEDAGOGISCH'] },
    { value: 'SONSTIGE', i18nKey: CATEGORY_I18N_KEYS['SONSTIGE'] },
  ];

  // Form
  readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    provider: [''],
    trainingDate: ['', [Validators.required, this.futureDateValidator]],
    hours: [
      null,
      [Validators.required, Validators.min(0.5), Validators.max(40)],
    ],
    category: ['FACHLICH', Validators.required],
    description: [''],
    documentUrl: [''],
  });

  private futureDateValidator(control: { value: string }) {
    if (!control.value) return null;
    const date = new Date(control.value);
    if (date > new Date()) {
      return { futureDate: true };
    }
    return null;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.submitError.set('File too large (max 5MB)');
        return;
      }
      this.selectedFileName.set(file.name);
      // In a real app, upload to storage and set URL
      // For now, just store the name
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.success.set(false);
    this.submitError.set(null);

    const dto: CreateEntryDto = {
      title: this.form.value.title,
      provider: this.form.value.provider || undefined,
      description: this.form.value.description || undefined,
      hours: this.form.value.hours,
      category: this.form.value.category,
      trainingDate: this.form.value.trainingDate,
      documentUrl: this.form.value.documentUrl || undefined,
      isInternal: false,
    };

    this.educationService.createEntry(dto).subscribe({
      next: (entry) => {
        this.submitting.set(false);
        this.success.set(true);
        this.entryCreated.emit(entry);
        this.form.reset({ category: 'FACHLICH' });
        this.selectedFileName.set(null);

        // Hide success message after 3 seconds
        setTimeout(() => this.success.set(false), 3000);
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(
          err.error?.message || 'Failed to save training entry'
        );
      },
    });
  }
}
