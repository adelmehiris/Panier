import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProductListComponent} from './product-list.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {By} from '@angular/platform-browser';
import {Component, Input, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Product} from '../../models/product';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  selector: 'app-product',
  template: '<div>{{ product.productName }}</div>',
})
class MockProductComponent {
  @Input() product: any;
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        MockProductComponent,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatCardModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideHttpClient(), provideHttpClientTesting()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;

    // Initialisation des catégories et produits
    component.categories = signal<string[]>(['Food', 'Books']);
    component.products = signal<Product[]>([
      {id: 1, productName: 'Product 1', category: 'Food', price: 100, isImported: false, quantity: 10},
      {id: 2, productName: 'Product 2', category: 'Books', price: 200, isImported: true, quantity: 5},
    ]);

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule(); // Réinitialise complètement TestBed
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display categories in the select dropdown', () => {
    const select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    select.click(); // Ouvre la liste déroulante
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('mat-option'));
    expect(options.length).toBe(2);
    expect(options[0].nativeElement.textContent.trim()).toBe('Food');
    expect(options[1].nativeElement.textContent.trim()).toBe('Books');
  });

  it('should call selectedCategory.set() on category selection change', () => {
    spyOn(component.selectedCategory, 'set');
    const select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    select.click(); // Ouvre la liste déroulante
    fixture.detectChanges();

    const option = fixture.debugElement.queryAll(By.css('mat-option'))[1].nativeElement;
    option.click(); // Sélectionne "Books"
    fixture.detectChanges();

    expect(component.selectedCategory.set).toHaveBeenCalledWith('Books');
  });

  it('should return all products when no category is selected', () => {
    // Vérifier que selectedCategory est vide
    component.selectedCategory.set('');
    fixture.detectChanges();

    // Vérifie que tous les produits sont retournés
    expect(component.filteredProducts()).toEqual([
      {id: 1, productName: 'Product 1', category: 'Food', price: 100, isImported: false, quantity: 10},
      {id: 2, productName: 'Product 2', category: 'Books', price: 200, isImported: true, quantity: 5},
    ]);
  });

  it('should return only products matching the selected category', () => {
    // Définir une catégorie sélectionnée
    component.selectedCategory.set('Food');
    fixture.detectChanges();

    // Vérifie que seuls les produits de la catégorie sélectionnée sont retournés
    expect(component.filteredProducts()).toEqual([
      {id: 1, productName: 'Product 1', category: 'Food', price: 100, isImported: false, quantity: 10}
    ]);
  });

  it('should return an empty array if no products match the selected category', () => {
    // Définir une catégorie qui ne correspond à aucun produit
    component.selectedCategory.set('Medecine');
    fixture.detectChanges();

    // Vérifie qu'aucun produit ne correspond
    expect(component.filteredProducts()).toEqual([]);
  });
});
