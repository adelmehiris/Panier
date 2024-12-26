import {computed, inject, Injectable, signal} from '@angular/core';
import {Product} from '../models/product';
import {CartItem} from '../models/cart-item';
import {ProductService} from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private productService = inject(ProductService);

  private cart = signal<CartItem[]>([]);
  getCartItems = computed(() => this.cart());

  addToCart(product: Product, quantityToAdd: number) {
    const existingItem = this.cart().find((item) => item.product.id === product.id);

    if (existingItem) {
      // Mise à jour de la quantité pour un produit existant
      this.cart.update((items) =>
        items.map((item) => item.product.id === product.id
          ? {...item, quantity: item.quantity + quantityToAdd}
          : item
        )
      );
    } else {
      // Ajout d'un nouveau produit au panier
      this.cart.update((items) => [...items, {product: product, quantity: quantityToAdd},]);
    }

    // Réduire la quantité en stock du produit
    product.quantity! -= quantityToAdd;
  }

  removeFromCart(itemToRemove: CartItem) {
    itemToRemove.product.quantity += itemToRemove.quantity;
    this.cart.update((items) => items.filter((item) => item.product.id !== itemToRemove.product.id));
  }

  getTotalTaxes() {
    return this.cart().reduce((total, item) => total + (item.quantity * this.productService.getTaxAmount(item.product)), 0);
  }

  getTotalTTC() {
    return this.cart().reduce((total, item) => total + (item.quantity * this.productService.getPriceTTC(item.product)), 0);
  }

}
