import {Product} from './product';

export interface CartItem {
  product: Product;
  quantity: number; // Quantité ajoutée au panier
}
