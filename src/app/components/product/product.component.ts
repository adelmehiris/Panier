import {Component, inject, input} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle} from '@angular/material/card';
import {IProduct} from '../../Interfaces/product.interface';
import {CurrencyPipe} from '@angular/common';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product',
  imports: [
    MatCardModule,
    CurrencyPipe
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  product = input<IProduct>({} as IProduct);


  private cartService = inject(CartService);

  addToCart(product: IProduct) {
    this.cartService.addToCart(product);
  }
}
