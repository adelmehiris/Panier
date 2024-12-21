import {computed, Injectable, signal} from '@angular/core';
import { IProduct } from '../models/product.interface';

@Injectable({
    providedIn: 'root'
})
export class CartService {

  private cart = signal<IProduct[]>([]);

  addToCart(product: IProduct, quantity: number) {
    const existingProduct = this.cart().find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity! += quantity;
      this.cart.update((items) =>
        items.map((item) =>
          item.id === product.id ? { ...item, quantity: existingProduct.quantity } : item
        )
      );
    } else {
      this.cart.update((items) => [...items, { ...product, quantity}]);
    }
  }

  getCartItems = computed(() => this.cart());

  removeFromCart(product: IProduct) {
    this.cart.update((items) => items.filter((item) => item.id !== product.id));
  }

  // Obtenir le nombre total d'articles dans le panier
  getTotalItemCount = computed(() =>
    this.cart().reduce((total, item) => total + (item.quantity || 1), 0)
  );

}
