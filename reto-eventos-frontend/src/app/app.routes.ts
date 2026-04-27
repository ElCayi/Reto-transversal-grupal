import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { AdminPageComponent } from './pages/admin/admin-page.component';
import { AdminReservationsPageComponent } from './pages/admin-reservations/admin-reservations-page.component';
import { EventDetailPageComponent } from './pages/event-detail/event-detail-page.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { ReservationsPageComponent } from './pages/reservations/reservations-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'registro', component: RegisterPageComponent },
  { path: 'eventos/:id', component: EventDetailPageComponent },
  { path: 'reservas', component: ReservationsPageComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminPageComponent, canActivate: [adminGuard] },
  { path: 'admin/reservas', component: AdminReservationsPageComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
