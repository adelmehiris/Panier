import {TestBed} from '@angular/core/testing';
import {CartService} from './cart.service';
import {ProductService} from './product.service';
import {Product} from '../models/product';
import {CartItem} from '../models/cart-item';

describe('CartService', () => {
  let cartService: CartService;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductService', ['getTaxAmount', 'getPriceTTC']);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        {provide: ProductService, useValue: spy}, // Mock du ProductService
      ],
    });

    cartService = TestBed.inject(CartService);
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  afterEach(() => {
    TestBed.resetTestingModule(); // Réinitialise complètement TestBed
  });

  it('should add a product to the cart', () => {
    const product: Product = {
      id: 1, productName: 'Product 1', price: 100, category: 'Food', isImported: false, quantity: 10,
    };

    cartService.addToCart(product, 2);

    const cartItems = cartService.getCartItems();
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].product).toEqual(product);
    expect(cartItems[0].quantity).toBe(2);
    expect(product.quantity).toBe(8); // Vérifie que la quantité en stock est mise à jour
  });

  it('should update quantity if the product is already in the cart', () => {
    const product: Product = {
      id: 1, productName: 'Product 1', price: 100, category: 'Food', isImported: false, quantity: 10,
    };

    cartService.addToCart(product, 2);
    cartService.addToCart(product, 3);

    const cartItems = cartService.getCartItems();
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].quantity).toBe(5);
    expect(product.quantity).toBe(5); // Vérifie que la quantité en stock est mise à jour
  });

  it('should remove a product from the cart', () => {
    const product: Product = {
      id: 1, productName: 'Product 1', price: 100, category: 'Food', isImported: false, quantity: 10,
    };

    cartService.addToCart(product, 2);

    const cartItems = cartService.getCartItems();
    expect(cartItems.length).toBe(1);

    const itemToRemove: CartItem = {product, quantity: 2};
    cartService.removeFromCart(itemToRemove);

    expect(cartService.getCartItems().length).toBe(0);
    expect(product.quantity).toBe(10); // Vérifie que la quantité en stock est restaurée
  });

  it('should calculate total taxes', () => {
    const product1: Product = {
      id: 1, productName: 'Product 1', price: 100, category: 'Food', isImported: false, quantity: 10,
    };

    const product2: Product = {
      id: 2, productName: 'Product 2', price: 200, category: 'Books', isImported: true, quantity: 5,
    };

    productServiceSpy.getTaxAmount.and.callFake((product: Product) => {
      if (product.id === 1) return 10; // Taxe pour le produit 1
      if (product.id === 2) return 20; // Taxe pour le produit 2
      return 0;
    });

    cartService.addToCart(product1, 2);
    cartService.addToCart(product2, 1);

    const totalTaxes = cartService.getTotalTaxes();
    expect(totalTaxes).toBe(40); // (2 * 10) + (1 * 20)
  });

  it('should calculate total TTC', () => {
    const product1: Product = {
      id: 1, productName: 'Product 1', price: 100, category: 'Food', isImported: false, quantity: 10,
    };

    const product2: Product = {
      id: 2, productName: 'Product 2', price: 200, category: 'Books', isImported: true, quantity: 5,
    };

    productServiceSpy.getPriceTTC.and.callFake((product: Product) => {
      if (product.id === 1) return 110; // TTC pour le produit 1
      if (product.id === 2) return 240; // TTC pour le produit 2
      return 0;
    });

    cartService.addToCart(product1, 2);
    cartService.addToCart(product2, 1);

    const totalTTC = cartService.getTotalTTC();
    expect(totalTTC).toBe(460); // (2 * 110) + (1 * 240)
  });

  it('should update the quantity of an existing product in the cart', () => {
    const product = {id: 1, productName: 'Product 1', price: 100, category: 'Food', isImported: false, quantity: 10,};
    cartService.addToCart(product, 2);
    cartService.addToCart(product, 3);

    expect(cartService.getCartItems()).toEqual([
      {product, quantity: 5},
    ]);
    expect(product.quantity).toBe(5); // Vérifie la réduction cumulative de stock
  });
});
