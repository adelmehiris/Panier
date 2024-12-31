import {TestBed} from '@angular/core/testing';
import {ProductService} from './product.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Product} from '../models/product';
import {provideHttpClient} from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [], // Fournit les outils pour tester HttpClient
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP non gérées
  });

  describe('getProducts', () => {
    it('should fetch products from the API and update the products signal', () => {
      const mockProducts: Product[] = [
        {id: 1, productName: 'Product 1', price: 100, category: 'Food', isImported: false, quantity: 10},
        {id: 2, productName: 'Product 2', price: 200, category: 'Books', isImported: true, quantity: 5},
      ];

      service.getProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
        expect(service.products()).toEqual(mockProducts); // Vérifie que le signal est mis à jour
      });

      const req = httpMock.expectOne(service.url);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts); // Simule une réponse avec les produits mockés
    });
  });

  describe('getTaxRate', () => {
    it('should return 0 for Food products', () => {
      const product: Product = {
        id: 1,
        productName: 'Apple',
        price: 100,
        category: 'Food',
        isImported: false,
        quantity: 10
      };
      expect(service.getTaxRate(product)).toBe(0);
    });

    it('should return 10 for Books', () => {
      const product: Product = {
        id: 2,
        productName: 'Book',
        price: 50,
        category: 'Books',
        isImported: false,
        quantity: 5
      };
      expect(service.getTaxRate(product)).toBe(10);
    });

    it('should return 20 for standard products', () => {
      const product: Product = {
        id: 3,
        productName: 'Laptop',
        price: 1000,
        category: 'Electronics',
        isImported: false,
        quantity: 2
      };
      expect(service.getTaxRate(product)).toBe(20);
    });

    it('should add 5 for imported products', () => {
      const product: Product = {
        id: 4,
        productName: 'Imported Chocolate',
        price: 150,
        category: 'Food',
        isImported: true,
        quantity: 4
      };
      expect(service.getTaxRate(product)).toBe(5); // 0 (Food) + 5 (Imported)
    });

    it('should calculate 25 for imported standard products', () => {
      const product: Product = {
        id: 5,
        productName: 'Imported Phone',
        price: 800,
        category: 'Electronics',
        isImported: true,
        quantity: 1
      };
      expect(service.getTaxRate(product)).toBe(25); // 20 (Standard) + 5 (Imported)
    });
  });

  describe('getTaxAmount', () => {
    it('should calculate tax amount for a standard product', () => {
      const product: Product = {
        id: 1,
        productName: 'Laptop',
        price: 1000,
        category: 'Electronics',
        isImported: false,
        quantity: 2
      };
      expect(service.getTaxAmount(product)).toBe(200); // 20% of 1000
    });

    it('should calculate tax amount for an imported product', () => {
      const product: Product = {
        id: 2,
        productName: 'Imported Laptop',
        price: 1000,
        category: 'Electronics',
        isImported: true,
        quantity: 1
      };
      expect(service.getTaxAmount(product)).toBe(250); // 25% of 1000
    });

    it('should calculate tax amount for a book', () => {
      const product: Product = {
        id: 3,
        productName: 'Book',
        price: 50,
        category: 'Books',
        isImported: false,
        quantity: 10
      };
      expect(service.getTaxAmount(product)).toBe(5); // 10% of 50
    });

    it('should round tax amount to nearest 0.05', () => {
      const product: Product = {
        id: 4,
        productName: 'Imported Item',
        price: 18.99,
        category: 'Electronics',
        isImported: true,
        quantity: 3
      };
      expect(service.getTaxAmount(product)).toBe(4.75); // Calcul et arrondi à 0.05
    });
  });

  describe('getPriceTTC', () => {
    it('should calculate total price including tax for a standard product', () => {
      const product: Product = {
        id: 1,
        productName: 'Laptop',
        price: 1000,
        category: 'Electronics',
        isImported: false,
        quantity: 2
      };
      expect(service.getPriceTTC(product)).toBe(1200); // 1000 + 200 (20% tax)
    });

    it('should calculate total price including tax for an imported product', () => {
      const product: Product = {
        id: 2,
        productName: 'Imported Laptop',
        price: 1000,
        category: 'Electronics',
        isImported: true,
        quantity: 1
      };
      expect(service.getPriceTTC(product)).toBe(1250); // 1000 + 250 (25% tax)
    });

    it('should calculate total price including tax for a book', () => {
      const product: Product = {
        id: 3,
        productName: 'Book',
        price: 50,
        category: 'Books',
        isImported: false,
        quantity: 10
      };
      expect(service.getPriceTTC(product)).toBe(55); // 50 + 5 (10% tax)
    });

    it('should round total price including tax to nearest 0.05', () => {
      const product: Product = {
        id: 4, productName: 'Imported Item', price: 18.99, category: 'Electronics', isImported: true, quantity: 3
      };
      expect(service.getPriceTTC(product)).toBe(23.74); // 18.99 + 4.75 (tax rounded)
    });
  });
});
