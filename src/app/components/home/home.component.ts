import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule,
    MatDivider
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
