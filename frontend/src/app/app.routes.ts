
import { Routes } from '@angular/router';
import { DestinationDetailsComponent } from './features/destinations/destination-details/destination-details.component';
import { HomeComponent } from './features/home/home.component';
import { DestinationListComponent } from './features/destinations/destination-list/destination-list.component';
import { TripListComponent } from './features/trips/trip-list/trip-list.component';
import { TripFormComponent } from './features/trips/trip-form/trip-form.component';
import { FavoritesComponent } from './features/favorites/favorites/favorites.component';
import { BudgetComponent } from './features/budget/budget/budget.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'TripWise | Home'
  },
  {
    path: 'destinations',
    component: DestinationListComponent,
    title: 'TripWise | Destinations'
  },
  {
    path: 'trips',
    component: TripListComponent,
    title: 'TripWise | My Trips'
  },
  {
    path: 'trips/new',
    component: TripFormComponent,
    title: 'TripWise | Plan a Trip'
  },
  {
    path: 'trips/:id/edit',
    component: TripFormComponent,
    title: 'TripWise | Edit Trip'

  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    title: 'TripWise | Favorites'
  },
  {
    path: 'budget',
    component: BudgetComponent,
    title: 'TripWise | Budget'
  },
  {
    path: '**',
    redirectTo: 'home'
  },
  {
  path: 'destinations/:id',
  component: DestinationDetailsComponent,
  title: 'TripWise | Destination Details'
},
];
