import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {ProductService} from '../../services/product.service';
import {ProductComponent} from '../product/product.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOption, MatSelectModule} from '@angular/material/select';
import { uniq } from 'lodash';
import {IProduct} from '../../Interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  imports: [
    MatCardModule,
    ProductComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOption
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  private productService = inject(ProductService);
  products = signal<IProduct[]>([]);
  selectedCategory = signal<string>('');
  categories = signal<string[]>([]);

  filteredProducts = computed(() => {
    const category = this.selectedCategory();
    return category
      ? this.products().filter((product) => product.category === category)
      : [];
  });

  ngOnInit() {
    // Récupération des produits depuis le service
    this.productService.getProducts().subscribe((products) => {
      this.products.set(products);

      // Extraction des catégories uniques avec Lodash
      this.categories.set(uniq(products.map((product) => product.category)));
    });
  }

}
