import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { getCampers } from 'src/app/services/tf-camp-api.service';
import { formatMongoDate, formatRegister } from 'src/app/utils/common';
import { GetCampersResponse } from 'src/app/interfaces/camper-responses.interface';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

    campers: GetCampersResponse;

    campers_table_data: any[];

    register_count: Number = 0;

    lastweek_count: Number = 0;

    woman_count: Number = 0;

    woman_lastweek_count: Number = 0;

    man_count: Number = 0;
    
    man_lastweek_count: Number = 0;

    loading: boolean = false;

    register: String = '';

    constructor(public layoutService: LayoutService) {
        
    }

    async ngOnInit() {

        this.campers = await getCampers();

        this.campers_table_data = this.campers.data;

        this.register_count = this.getTotalRegisters();

        this.lastweek_count = this.getLastWeekRegisters();

        this.woman_count = this.getRegistersBySex("F");

        this.man_count = this.getRegistersBySex("M");

        this.woman_lastweek_count = this.getLastWeekRegistersBySex("F");

        this.man_lastweek_count = this.getLastWeekRegistersBySex("M");
    }

    getRegister = (registro: String) => {
        return formatRegister(registro);
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

        const unaSemanaEnMS = 7 * 24 * 60 * 60 * 1000; // Una semana en milisegundos
        const fechaHoy = new Date(); // Fecha de hoy
        const fechaHaceUnaSemana = new Date(fechaHoy.getTime() - unaSemanaEnMS);

        if (this.campers.data.length > 0) {
            const registrosUltimaSemana = this.campers.data.filter(registro => {
                const fechaRegistro = formatMongoDate(registro.fecha_registro);
                return fechaRegistro >= fechaHaceUnaSemana && fechaRegistro <= fechaHoy;
            });

            const registrosUltimaSemanabySex = registrosUltimaSemana.filter(registro => registro.sexo === sex)

            return registrosUltimaSemanabySex.length;
        } else {
            return 0;
        }
    }
}
