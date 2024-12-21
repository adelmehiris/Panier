import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IProduct} from '../models/product.interface';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  products = signal<IProduct[]>([]);

  readonly url = 'http://localhost:3001/products';

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.url).pipe(
      tap(products => this.products.set(products))
    );
  }

}
