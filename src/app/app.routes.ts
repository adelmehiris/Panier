import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: "products",
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(
        value => value.ProductListComponent
      ),
  },
  {
    path: "cart",
    loadComponent: () =>
      import('./components/cart/cart.component').then(
        value => value.CartComponent
      ),
  },
];
