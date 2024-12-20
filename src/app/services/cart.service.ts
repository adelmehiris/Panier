import {computed, Injectable, signal} from '@angular/core';
import { IProduct } from '../Interfaces/product.interface';

@Injectable({
    providedIn: 'root'
})
export class CartService {

  private cart = signal<IProduct[]>([]);

  addToCart(product: IProduct) {
    const existingProduct = this.cart().find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.update((items) => [...items, { ...product, quantity: 1 }]);;
    }
  }

  getCartItems = computed(() => this.cart());

  removeFromCart(product: IProduct) {
    this.cart.update((items) => items.filter((item) => item.id !== product.id));
  }
}
