import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';

export const routes: Routes = [
  {
    path : "home",
    component : HomeComponent
  },
  {
    path : "products",
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(value => value.ProductListComponent),
  },
  {
    path : "cart",
    loadComponent: () =>
      import('./components/cart/cart.component').then(value => value.CartComponent),
  },
];
