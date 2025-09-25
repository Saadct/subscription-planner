import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Subscription } from '../../../subscriptions/models/subscription.model';
import { SubscriptionService } from '../../../subscriptions/services/subscription.service';
import { CommonModule } from '@angular/common';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts: () => import('echarts') // lazy load d’echarts
      }
    }
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  subscriptions: Subscription[] = [];
  categories: Category[] = [];

  totalSubscriptions = 0;
  totalCost = 0;

  // Options pour ngx-echarts
  subscriptionsByCategoryOptions: EChartsOption = {};
  costByCategoryOptions: EChartsOption = {};
  monthlyOptions: EChartsOption = {};

  private subscriptionService = inject(SubscriptionService);
  private categoryService = inject(CategoryService);

  async ngOnInit() {
    this.subscriptions = await this.subscriptionService.getAllSubscriptions();
    this.categories = await this.categoryService.getAllCategories();

    this.buildChartsData();
  }

  buildChartsData() {
    this.totalSubscriptions = this.subscriptions.length;
    this.totalCost = this.subscriptions.reduce((acc, sub) => acc + sub.price, 0);

    // --- Abonnements par catégorie
    const counts: Record<string, number> = {};
    this.subscriptions.forEach(sub => {
      const category = this.categories.find(c => c.id === sub.categoryId.toString());
      if (category) counts[category.label] = (counts[category.label] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = Object.values(counts);

    this.subscriptionsByCategoryOptions = {
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [
        {
          name: 'Abonnements',
          type: 'pie',
          radius: '50%',
          data: labels.map((label, i) => ({ value: data[i], name: label })),
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
        }
      ]
    };

    // --- Coût par catégorie
    const costs: Record<string, number> = {};
    this.subscriptions.forEach(sub => {
      const category = this.categories.find(c => c.id === sub.categoryId.toString());
      if (category) costs[category.label] = (costs[category.label] || 0) + sub.price;
    });
    const costLabels = Object.keys(costs);
    const costData = Object.values(costs);

    this.costByCategoryOptions = {
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [
        {
          name: 'Coût',
          type: 'pie',
          radius: ['40%', '70%'], // doughnut
          data: costLabels.map((label, i) => ({ value: costData[i], name: label })),
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
        }
      ]
    };

    // --- Timeline par mois
    const monthlyCounts: Record<string, number> = {};
    this.subscriptions.forEach(sub => {
      const month = sub.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    const monthlyLabels = Object.keys(monthlyCounts);
    const monthlyData = Object.values(monthlyCounts);

    this.monthlyOptions = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: monthlyLabels },
      yAxis: { type: 'value' },
      series: [{ data: monthlyData, type: 'line', smooth: true }]
    };
  }
}
