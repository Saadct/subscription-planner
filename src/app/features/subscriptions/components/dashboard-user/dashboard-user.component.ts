import { Component, computed, OnInit, Signal } from '@angular/core';
import { Subscription } from '../../../subscriptions/models/subscription.model';
import { SubscriptionService } from '../../../subscriptions/services/subscription.service';
import { CommonModule } from '@angular/common';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { Category } from '../../../admin/models/category.model';
import { CategoryService } from '../../../admin/services/category.service';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-dashboard-user',
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
    templateUrl: './dashboard-user.component.html',
    styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
    subscriptions!: Signal<Subscription[]>;
    categories: Category[] = [];

    totalSubscriptions = 0;
    totalCost!: Signal<number>;

    // Options pour ngx-echarts
    subscriptionsByCategoryOptions: EChartsOption = {};
    costByCategoryOptions: EChartsOption = {};
    monthlyOptions: EChartsOption = {};

    constructor(
        private subscriptionService: SubscriptionService,
        private categoryService: CategoryService
    ) { }

    async ngOnInit() {
        const userId = localStorage.getItem("currentUserId") || "";
        this.subscriptions = this.subscriptionService.getSubscriptionsByUserId(userId);
        this.categories = await this.categoryService.getAllCategories();

        // ✅ totalCost calculé automatiquement quand subscriptions change
        this.totalCost = computed(() =>
            this.subscriptions().reduce((acc, sub) => acc + sub.price, 0)
        );

        this.buildChartsData();
    }

    buildChartsData() {
        const subs = this.subscriptions(); // ✅ on récupère la valeur du signal

        // --- Nombre total
        this.totalSubscriptions = subs.length;

        // --- Abonnements par catégorie
        const counts: { [key: string]: number } = {};
        subs.forEach(sub => {
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
        const costs: { [key: string]: number } = {};
        subs.forEach(sub => {
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
        const monthlyCounts: { [key: string]: number } = {};
        subs.forEach(sub => {
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
