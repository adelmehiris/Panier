import {Component, input, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {IProduct} from '../../models/product.interface';
import {CurrencyPipe} from '@angular/common';
import {CartService} from '../../services/cart.service';
import {ceil} from 'lodash';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-product',
  imports: [
    MatCardModule,
    CurrencyPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIcon,
    MatButton
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  product = input<IProduct>({} as IProduct);


  constructor(public cartService: CartService) {
  }

  // Signal pour la quantité sélectionnée
  selectedQuantity = signal<number>(1);


  addToCart() {
    this.cartService.addToCart(this.product(), this.selectedQuantity());
  }


  calculatePriceTTC(product: IProduct): number {
    let taxRate = 0;

    // Déterminer le taux de taxe
    switch (product.category) {
      case 'Food':
      case 'Medicine':
        taxRate = 0; // Aucune taxe
        break;
      case 'Books':
        taxRate = 10; // Taxe sur les livres
        break;
      default:
        taxRate = 20; // Taxe standard pour les autres produits
        break;
    }

    // Ajouter une taxe additionnelle de 5% pour les produits importés
    if (product.isImported) {
      taxRate += 5;
    }

    // Calcul du montant TTC avec arrondi des taxes aux 5 centimes supérieurs
    const tax = ceil((product.price * taxRate) / 100, 2);
    return product.price + tax;
  }
}
