import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {CartService} from './services/cart.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatButton,
    MatToolbar,
    MatIcon,
    MatIconButton,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Panier';

  private cartService = inject(CartService);

  // Signal pour le compteur d'articles
  totalItemCount = this.cartService.getTotalItemCount;
}
