import {Component, computed} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {CartService} from '../../services/cart.service';
import {IProduct} from '../../models/product.interface';
import {MatListModule} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-cart',
  imports: [
    MatCardModule,
    MatTableModule,
    MatListModule,
    CurrencyPipe,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  displayedColumns: string[] = ['name', 'quantity', 'price', 'action'];

  constructor(public cartService: CartService) {
  }

  cartItems = computed(() => this.cartService.getCartItems());

  removeFromCart(product: IProduct) {
    this.cartService.removeFromCart(product);
  }

}
