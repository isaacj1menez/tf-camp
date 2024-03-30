import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { getCampers } from 'src/app/services/tf-camp-api.service';
import { formatMongoDate } from 'src/app/utils/common';
import { GetCampersResponse } from 'src/app/interfaces/camper-responses.interface';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    campers: GetCampersResponse;

    campers_table_data: any[];

    register_count: Number = 0;

    lastweek_count: Number = 0;

    woman_count: Number = 0;

    woman_lastweek_count: Number = 0;

    man_count: Number = 0;
    
    man_lastweek_count: Number = 0;

    loading: boolean = false;

    constructor(private productService: ProductService, public layoutService: LayoutService) {
        
    }

    async ngOnInit() {
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];

        this.campers = await getCampers();

        this.campers_table_data = this.campers.data;

        this.register_count = this.getTotalRegisters();

        this.lastweek_count = this.getLastWeekRegisters();

        this.woman_count = this.getRegistersBySex("F");

        this.man_count = this.getRegistersBySex("M");

        this.woman_lastweek_count = this.getLastWeekRegistersBySex("F");

        this.man_lastweek_count = this.getLastWeekRegistersBySex("M");
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onRowSelect(event: any){
        console.log(event);
    }

    getTotalRegisters = () => {
        if (this.campers.data.length > 0) {
            return this.campers.total;
        } else {
            return 0;
        }
    }

    getLastWeekRegisters = () => {

        const unaSemanaAtras = new Date();
        unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);

        if (this.campers.data.length > 0) {
            const registrosUltimaSemana = this.campers.data.filter(registro => {
                const fechaRegistro = formatMongoDate(registro.fecha_registro);
                return fechaRegistro >= unaSemanaAtras;
            });

            return registrosUltimaSemana.length;
        } else {
            return 0;
        }
    }

    getRegistersBySex = (sex: string) => {

        if (this.campers.data.length > 0) {
            const total = this.campers.data.filter(registro => {
                return registro.sexo === sex;
            });

            return total.length;
        } else {
            return 0;
        }
    }

    getLastWeekRegistersBySex = (sex: string) => {

        const unaSemanaAtras = new Date();
        unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);

        if (this.campers.data.length > 0) {
            const registrosUltimaSemana = this.campers.data.filter(registro => {
                const fechaRegistro = formatMongoDate(registro.fecha_registro);
                return fechaRegistro >= unaSemanaAtras;
            });

            const registrosUltimaSemanabySex = registrosUltimaSemana.filter(registro => registro.sexo === sex)

            return registrosUltimaSemanabySex.length;
        } else {
            return 0;
        }
    }
}
