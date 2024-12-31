import {TestBed} from '@angular/core/testing';
import {Router, RouterModule} from '@angular/router';
import {Location} from '@angular/common';
import {routes} from './app.routes';

describe('App Routing', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes)]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    router.initialNavigation(); // Initialise la navigation
  });

  it('should navigate to "/products" when visiting the Shop route', async () => {
    await router.navigate(['/products']);
    expect(location.path()).toBe('/products');
  });

  it('should navigate to "/cart" when visiting the Cart route', async () => {
    await router.navigate(['/cart']);
    expect(location.path()).toBe('/cart');
  });
});
