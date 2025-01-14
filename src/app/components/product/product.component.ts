import {Component, inject, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {Product} from '../../models/product';
import {CurrencyPipe} from '@angular/common';
import {CartService} from '../../services/cart.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-product',
  imports: [
    MatCardModule,
    CurrencyPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  product = input<Product>({} as Product);

  private cartService = inject(CartService);
  private productService = inject(ProductService);

  selectedQuantity = 1;

  addToCart() {
    this.cartService.addToCart(this.product(), this.selectedQuantity);
  }

  calculatePriceTTC(product: Product): number {
    return this.productService.getPriceTTC(product);
  }

}
