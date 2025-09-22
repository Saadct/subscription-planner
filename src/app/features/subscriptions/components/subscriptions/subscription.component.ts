import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSubscription, Subscription, UpdateSubscription } from '../../models/subscription.model';
import { SubscriptionService } from '../../services/subscription.service';
import { SubscriptionAddComponent } from '../subsccription-add/subscription-add.component';
import { SubscriptionEditComponent } from '../subscription-edit/subscription-edit.component';
import { PriceEuroPipe } from "../../../../shared/pipes/price/price.pipe";

@Component({
  selector: 'app-subscription-calendar',
  standalone: true,
  imports: [CommonModule, SubscriptionAddComponent, SubscriptionEditComponent, PriceEuroPipe],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
})
export class SubscriptionCalendarComponent implements OnInit {
  // subscriptions = signal<Subscription[]>([]);
  // signal pour filtrer les abonnements
  subscriptions = computed(() =>
    this.subscriptionService.getSubscriptionsByUserId(this.userId)()
  );
  loading = signal(true);
  userId: string = "";

  // Drawers
  addDrawerOpen = false;
  editDrawerOpen = false;
  selectedSubscription: Subscription | null = null; // abonnement sélectionné pour édition

  month = signal(new Date().getMonth());
  year = signal(new Date().getFullYear());
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  constructor(private subscriptionService: SubscriptionService) { }

  async ngOnInit() {
    this.userId = localStorage.getItem("currentUserId") || "";

    // await this.loadSubscriptions();
  }

  // async loadSubscriptions() {
  //   this.loading.set(true);
  //   try {
  //     const subs = await this.subscriptionService.getSubscriptionsByUserId(this.userId);
  //     this.subscriptions.set(subs);
  //   } finally {
  //     this.loading.set(false);
  //   }
  // }

  // Création d'un nouvel abonnement
  async saveNewSubscription(data: AddSubscription) {
    await this.subscriptionService.createSubscription({
      ...data,
      paymentDate: new Date(data.paymentDate),
      userId: this.userId
    });
    // await this.loadSubscriptions();
    this.closeAddDrawer();
  }

  // Mise à jour d'un abonnement existant
  async updateSubscription(data: UpdateSubscription) {
    await this.subscriptionService.updateSubscription(data.id, {
      ...data,
      paymentDate: new Date(data.paymentDate),
      userId: this.userId
    });
    // await this.loadSubscriptions();
    this.closeEditDrawer();
  }

  // Supprimer un abonnement avec confirmation
  async confirmDelete(subscription: Subscription, event: Event) {
    event.stopPropagation(); // Empêche de déclencher le drawer en même temps
    const confirmed = confirm(`Voulez-vous vraiment supprimer l'abonnement "${subscription.name}" ?`);
    if (!confirmed) return;

    await this.subscriptionService.deleteSubscription(subscription.id);
    // await this.loadSubscriptions();
  }


  // Ouvrir drawer création
  openAddDrawer() {
    this.addDrawerOpen = true;
  }

  closeAddDrawer() {
    this.addDrawerOpen = false;
  }

  // Ouvrir drawer édition
  openEditDrawer(subscription: Subscription) {
    this.selectedSubscription = subscription;
    this.editDrawerOpen = true;
  }

  closeEditDrawer() {
    this.editDrawerOpen = false;
    this.selectedSubscription = null;
  }

  // Calendrier
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
      const date = new Date(sub.paymentDate);
      const current = new Date(this.year(), this.month(), day);
      return current >= date && current.getDate() === date.getDate();
    });
  }

  currentMonthName() {
    return new Date(this.year(), this.month(), 1).toLocaleString('fr-FR', { month: 'long' });
  }

  currentYear() {
    return this.year();
  }

  prevMonth() {
    let m = this.month() - 1, y = this.year();
    if (m < 0) { m = 11; y--; }
    this.month.set(m); this.year.set(y);
  }

  nextMonth() {
    let m = this.month() + 1, y = this.year();
    if (m > 11) { m = 0; y++; }
    this.month.set(m); this.year.set(y);
  }
}
