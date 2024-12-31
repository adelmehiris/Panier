import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Product} from '../models/product';
import {Cacheable} from 'ts-cacheable';
import {ceil} from 'lodash';
import {environement} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private httpClient = inject(HttpClient);

  products = signal<Product[]>([]);

  readonly url = `${environement.BASE_URL}/products`;

  @Cacheable()
  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.url).pipe(
      tap(products => {
        this.products.set(products);
      })
    );
  }

  getTaxRate(product: Product): number {
    let taxRate = 0;

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

    return taxRate + (product.isImported ? 5 : 0);
  }

  getTaxAmount(product: Product): number {
    const calculatedTax = (product.price * this.getTaxRate(product)) / 100;
    return ceil(calculatedTax * 20) / 20;
  }

  getPriceTTC(product: Product): number {
    return product.price + this.getTaxAmount(product);
  }

}
