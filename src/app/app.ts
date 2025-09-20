import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component.";
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, RouterTestingModule // 👈 ajoute ça pour fournir le Router et ActivatedRoute
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('subscription-planner');
}
