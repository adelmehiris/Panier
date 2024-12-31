import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProductComponent} from './product.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {InputSignal, signal} from '@angular/core';
import {Product} from '../../models/product';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CartService} from '../../services/cart.service';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', [
      'addToCart',
      'removeFromCart',
      'getTotalTaxes',
      'getTotalTTC',
    ]);
    await TestBed.configureTestingModule({
      imports: [
        ProductComponent,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: CartService, useValue: cartServiceSpy},
        provideHttpClient(), provideHttpClientTesting()
      ],
    }).compileComponents();

    mockCartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;

    // Initialisation du produit
    component.product = signal<Product>({
      id: 1,
      productName: 'Produit Test',
      price: 100,
      category: 'Catégorie Test',
      isImported: false,
      quantity: 10,
    }).asReadonly() as InputSignal<Product>;

    component.selectedQuantity = 1; // Quantité initiale
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule(); // Réinitialise complètement TestBed
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display product details correctly', () => {
    const productName = fixture.debugElement.query(By.css('.product-name')).nativeElement;
    expect(productName.textContent).toContain('Produit Test');

    const category = fixture.debugElement.query(By.css('.category')).nativeElement;
    expect(category.textContent).toContain('Catégorie Test');

    const price = fixture.debugElement.query(By.css('.price')).nativeElement;
    expect(price.textContent).toContain('€120.00'); // le prix TTC
  });

  it('should display "in stock" message when quantity > 0', () => {
    const inStockMessage = fixture.debugElement.query(By.css('.in-stock')).nativeElement;
    expect(inStockMessage.textContent).toContain('Quantité en stock : 10');
  });

  it('should display "out of stock" message when quantity is 0', () => {
    component.product = signal<Product>({
      id: 1,
      productName: 'Produit Test',
      price: 100,
      category: 'Catégorie Test',
      isImported: false,
      quantity: 0,
    }).asReadonly() as InputSignal<Product>;

    fixture.detectChanges();

    const outOfStockMessage = fixture.debugElement.query(By.css('.out-of-stock')).nativeElement;
    expect(outOfStockMessage.textContent).toContain('Non disponible');
  });

  it('should disable "Add to Cart" button when quantity is 0', () => {
    component.product = signal<Product>({
      id: 1,
      productName: 'Produit Test',
      price: 100,
      category: 'Catégorie Test',
      isImported: false,
      quantity: 0,
    }).asReadonly() as InputSignal<Product>;
    fixture.detectChanges();

    const addToCartButton = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(addToCartButton.disabled).toBeTrue();
  });

  it('should call addToCart when "Add to Cart" button is clicked', () => {
    spyOn(component, 'addToCart');
    const addToCartButton = fixture.debugElement.query(By.css('button')).nativeElement;
    addToCartButton.click();

    expect(component.addToCart).toHaveBeenCalled();
  });

  it('should update selectedQuantity when input changes', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 5;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.selectedQuantity).toBe(5);
  });

  it('should call CartService.addToCart with the correct arguments', () => {
    component.addToCart();

    expect(mockCartService.addToCart).toHaveBeenCalledWith(
      {id: 1, productName: 'Produit Test', price: 100, category: 'Catégorie Test', isImported: false, quantity: 10},
      1
    );
  });

});
