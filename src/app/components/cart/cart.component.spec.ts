import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CartComponent} from './cart.component';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../models/cart-item';
import {By} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getCartItems',
      'removeFromCart',
      'getTotalTaxes',
      'getTotalTTC',
    ]);

    await TestBed.configureTestingModule({
      imports: [ // Ajoutez CartComponent ici dans imports
        CartComponent,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
      ],
      providers: [
        {provide: CartService, useValue: cartServiceSpy},
        provideHttpClient(), provideHttpClientTesting()
      ],
    }).compileComponents();

    mockCartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule(); // Réinitialise complètement TestBed
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display cart items', () => {
    const mockCartItems: CartItem[] = [
      {
        product: {
          id: 1,
          productName: 'Product 1',
          price: 100,
          category: 'Category A',
          isImported: false,
          quantity: 10,
        },
        quantity: 2,
      },
      {
        product: {
          id: 2,
          productName: 'Product 2',
          price: 200,
          category: 'Category B',
          isImported: true,
          quantity: 5,
        },
        quantity: 1,
      },
    ];

    mockCartService.getCartItems.and.returnValue(mockCartItems);
    mockCartService.getTotalTaxes.and.returnValue(30);
    mockCartService.getTotalTTC.and.returnValue(330);

    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(listItems.length).toBe(2);

    const totalTaxes = fixture.debugElement.query(By.css('.cart-total')).nativeElement.textContent;
    expect(totalTaxes).toContain('Total taxes : €30');

    const totalTTC = fixture.debugElement.query(By.css('.cart-total')).nativeElement.textContent;
    expect(totalTTC).toContain('Total TTC : €330');
  });

  it('should call removeFromCart when delete button is clicked', () => {
    const mockCartItems: CartItem[] = [
      {
        product: {
          id: 1,
          productName: 'Product 1',
          price: 100,
          category: 'Category A',
          isImported: false,
          quantity: 10,
        },
        quantity: 2,
      },
    ];

    mockCartService.getCartItems.and.returnValue(mockCartItems);
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    deleteButton.triggerEventHandler('click', null);

    expect(mockCartService.removeFromCart).toHaveBeenCalledWith(mockCartItems[0]);
  });

  it('should display empty state if cart is empty', () => {
    mockCartService.getCartItems.and.returnValue([]);
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card).toBeNull(); // Vérifie qu'aucun contenu n'est affiché
  });
});
