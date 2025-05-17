import { Routes } from '@angular/router';
import { PaymentResultPageComponent } from './payment-result-page.component';

export const PAYMENT_RESULT_ROUTES: Routes = [
  { path: '', component: PaymentResultPageComponent }
  // Podríamo tener rutas como 'success' o 'failure' aquí:
  // { path: 'success', component: PaymentSuccessComponent },
  // { path: 'failure', component: PaymentFailureComponent },
];