import {Component, computed, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {CartService} from './services/cart.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatBadge} from '@angular/material/badge';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatToolbar,
    MatIcon,
    MatIconButton,
    CommonModule,
    FormsModule,
    MatBadge
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Panier';

  private cartService = inject(CartService);

  // Signal pour le compteur d'articles
  totalItemCount = computed(() => this.cartService.getCartItems().length);
}
