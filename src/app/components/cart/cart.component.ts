import {Component, computed, inject, signal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTable, MatTableModule} from '@angular/material/table';
import {CartService} from '../../services/cart.service';
import {IProduct} from '../../Interfaces/product.interface';

@Component({
  selector: 'app-cart',
  imports: [
    CurrencyPipe,
    MatCardModule,
    MatTableModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  displayedColumns: string[] = ['name', 'quantity', 'price', 'action'];

  private cartService = inject(CartService);

  cartItems = computed(() => this.cartService.getCartItems());

  removeFromCart(product: IProduct) {
    this.cartService.removeFromCart(product);
  }

}
