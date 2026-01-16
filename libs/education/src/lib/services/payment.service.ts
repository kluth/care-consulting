import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

  async redirectToCheckout(courseId: string, courseTitle: string, amount: number) {
    const session = await firstValueFrom(
      this.http.post<{ url: string }>('/api/payments/create-checkout-session', {
        courseId,
        courseTitle,
        amount,
        successUrl: `${window.location.origin}/courses/${courseId}?payment=success`,
        cancelUrl: `${window.location.origin}/courses/${courseId}?payment=cancelled`,
      })
    );

    if (session?.url) {
      window.location.href = session.url;
    }
  }
}
