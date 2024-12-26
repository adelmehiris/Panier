import {Component, computed, inject} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {CartService} from '../../services/cart.service';
import {MatListModule} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {CartItem} from '../../models/cart-item';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-cart',
  imports: [
    MatCardModule,
    MatTableModule,
    MatListModule,
    CurrencyPipe,
    MatIcon,
    MatIconButton,
    MatButton
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  private cartService = inject(CartService);
  private productService = inject(ProductService);

  cartItems = computed(() => this.cartService.getCartItems());

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  getPriceHT(item: CartItem): number {
    return item.product.price;
  }

  getPriceTTC(item: CartItem): number {
    return this.productService.getPriceTTC(item.product);
  }

  getTax(item: CartItem): number {
    return this.productService.getTaxAmount(item.product);
  }

  getTotalTaxes(): number {
    return this.cartService.getTotalTaxes();
  }

  getTotalTTC(): number {
    return this.cartService.getTotalTTC();
  }

}
