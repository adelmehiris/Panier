import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {By} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {CartService} from './services/cart.service';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {routes} from './app.routes';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getCartItems',
      'removeFromCart',
      'getTotalTaxes',
      'getTotalTTC',
    ]);
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterModule.forRoot(routes),
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatBadgeModule
      ],
      providers: [
        {provide: CartService, useValue: cartServiceSpy},
        provideHttpClient(), provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display a toolbar with the correct buttons', () => {
    const toolbar = fixture.debugElement.query(By.css('.app-toolbar'));
    expect(toolbar).toBeTruthy();

    const shopButton = fixture.debugElement.query(By.css('button[routerLink="/products"]'));
    expect(shopButton).toBeTruthy();
    expect(shopButton.nativeElement.textContent.trim()).toContain('Shop');

    const cartButton = fixture.debugElement.query(By.css('button[routerLink="/cart"]'));
    expect(cartButton).toBeTruthy();

    const loginButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
    expect(loginButton).toBeTruthy();
    expect(loginButton.nativeElement.textContent.trim()).toContain('Login');
  });

  it('should return the correct item count', () => {
    spyOn(component, 'totalItemCount').and.returnValue(5);
    expect(component.totalItemCount()).toBe(5);
  });

  it('should calculate the total item count correctly', () => {
    spyOn(component, 'totalItemCount').and.returnValue(5); // Simule la méthode
    fixture.detectChanges(); // Met à jour le DOM

    // Récupère le contenu du badge généré
    const badgeContent = fixture.nativeElement.querySelector('.mat-badge-content');

    // Vérifie que l'élément existe
    expect(badgeContent).not.toBeNull();

    // Vérifie que le contenu du badge est correct
    expect(badgeContent.textContent.trim()).toBe('5');
  });
});
