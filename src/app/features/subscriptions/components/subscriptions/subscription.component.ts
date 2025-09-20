import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from '../../models/subscription.model';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
    selector: 'app-subscription-calendar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-5xl mx-auto p-4">
      <h2 class="text-3xl font-bold mb-6">Calendrier des abonnements</h2>

      <div class="flex justify-between items-center mb-4">
        <button (click)="prevMonth()" class="px-3 py-1 bg-gray-200 rounded">← Mois précédent</button>
        <h3 class="text-sm font-semibold">{{ currentMonthName() }} {{ currentYear() }}</h3>
        <button (click)="nextMonth()" class="px-3 py-1 bg-gray-200 rounded">Mois suivant →</button>
      </div>

      <!-- Calendrier -->
      <div class="grid grid-cols-7 gap-1">
        <!-- Jours de la semaine -->
        <div *ngFor="let day of weekDays" class="text-center font-semibold py-1">
          {{ day }}
        </div>

        <!-- Cases vides avant le premier jour -->
        <div *ngFor="let _ of emptyStartDays" class="border h-20"></div>

        <!-- Cases du mois -->
        <div *ngFor="let day of daysInMonth" class="border h-20 p-1 relative group">
          <div class="absolute top-1 left-1 text-xs font-semibold">{{ day }}</div>

          <!-- Abonnements du jour -->
          <ng-container *ngIf="subscriptionsForDay(day).length > 0">
            <ng-container *ngIf="subscriptionsForDay(day).length <= 2">
              <!-- Afficher tous les abonnements si <= 2 -->
              <div *ngFor="let sub of subscriptionsForDay(day)"
                   [ngStyle]="{ 'background-color': sub.color || '#3b82f6' }"
                   class="text-white text-xs rounded px-1 py-0.5 mt-4 block truncate">
                {{ sub.name }}
              </div>
            </ng-container>

            <ng-container *ngIf="subscriptionsForDay(day).length > 2">
              <!-- Afficher le nombre total -->
       <div class="flex justify-center items-center h-full">
        <div class="text-white text-lg rounded px-2 py-1 bg-gray-700">
          +{{ subscriptionsForDay(day).length }}
        </div>
      </div>
            </ng-container>

            <!-- Tooltip pour tous les abonnements -->
            <div class="absolute z-20 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded shadow-lg top-full left-0 mt-1 w-48">
              <div *ngFor="let sub of subscriptionsForDay(day)">
                {{ sub.name }} - {{ sub.price }}€
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
    styles: [`
      /* Tooltip personnalisé */
      .group:hover .group-hover\\:block {
        display: block;
      }
    `]
})
export class SubscriptionCalendarComponent implements OnInit {

    subscriptions = signal<Subscription[]>([]);
    loading = signal(true);

    month = signal(new Date().getMonth());
    year = signal(new Date().getFullYear());

    weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    constructor(private subscriptionService: SubscriptionService) { }

    async ngOnInit() {
        await this.loadSubscriptions();
    }

    async loadSubscriptions() {
        try {
            this.loading.set(true);
            const subs = await this.subscriptionService.getAllSubscriptions(); // TODO: userId dynamique
            this.subscriptions.set(subs);
        } catch (error) {
            console.error('Erreur lors du chargement des abonnements:', error);
        } finally {
            this.loading.set(false);
        }
    }

    currentMonthName() {
        return new Date(this.year(), this.month(), 1).toLocaleString('fr-FR', { month: 'long' });
    }

    currentYear() {
        return this.year();
    }

    prevMonth() {
        let m = this.month() - 1;
        let y = this.year();
        if (m < 0) { m = 11; y--; }
        this.month.set(m);
        this.year.set(y);
    }

    nextMonth() {
        let m = this.month() + 1;
        let y = this.year();
        if (m > 11) { m = 0; y++; }
        this.month.set(m);
        this.year.set(y);
    }

    get daysInMonth() {
        const date = new Date(this.year(), this.month() + 1, 0);
        return Array.from({ length: date.getDate() }, (_, i) => i + 1);
    }

    get emptyStartDays() {
        const firstDay = new Date(this.year(), this.month(), 1).getDay();
        const offset = firstDay === 0 ? 6 : firstDay - 1;
        return Array.from({ length: offset });
    }

    subscriptionsForDay(day: number) {
        return this.subscriptions().filter(sub => {
            const d = new Date(sub.paymentDate);
            return d.getDate() === day && d.getMonth() === this.month() && d.getFullYear() === this.year();
        });
    }
}
