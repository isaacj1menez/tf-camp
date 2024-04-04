import { Component } from '@angular/core';
import { deleteCampers, getCampers } from 'src/app/services/tf-camp-api.service';
import { formatMongoDate } from 'src/app/utils/common';
import { Camper, GetCampersResponse } from 'src/app/interfaces/camper-responses.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import axios, { AxiosResponse } from 'axios';
import Swal from 'sweetalert2'

@Component({
    templateUrl: './dashboard.component.html',
    providers: [ConfirmationService, MessageService]
})
export class DashboardComponent {

    baseUrl: string = 'https://tf-camp-api.onrender.com/api/payments';

    campers: GetCampersResponse;
    
    camper: any = {};

    campers_table_data: any[];

    register_count: Number = 0;

    lastweek_count: Number = 0;

    woman_count: Number = 0;

    woman_lastweek_count: Number = 0;

    man_count: Number = 0;
    
    man_lastweek_count: Number = 0;

    loading: boolean = false;

    register: String = '';

    visible: boolean = false;

    cols: any[] = [];

    camperDialog: boolean = false;

    deleteCamperDialog: boolean = false;

    deleteCampersDialog: boolean = false;

    rowsPerPageOptions = [5, 10, 20];

    selectedCampers: Camper[] = [];

    show_error: boolean = false;

    monto: number = 0;

    viewCamperDialog: boolean = false;
    

    constructor(private confirmationService: ConfirmationService, private router: Router) { }

    async ngOnInit() {
        this.campers = await getCampers();

        this.campers_table_data = this.campers.data;

        this.register_count = this.getTotalRegisters();

        this.lastweek_count = this.getLastWeekRegisters();

        this.woman_count = this.getRegistersBySex("F");

        this.man_count = this.getRegistersBySex("M");

        this.woman_lastweek_count = this.getLastWeekRegistersBySex("F");

        this.man_lastweek_count = this.getLastWeekRegistersBySex("M");

        this.cols = [
            { field: 'registro', header: 'Número de registro' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'edad', header: 'Edad' },
            { field: 'telefono', header: 'Telefono' }
        ];
    }

    showViewCamper = (camper: Camper) => {
        this.camper = { ...camper };
        this.router.navigate(['uikit/input', camper.registro])
    }

    showPayment(camper: Camper) {
        this.camper = { ...camper };
        this.camperDialog = true;
    }

    addPayment = async (camper_id: string) => {
        try {

            if(this.monto <= 0){
                this.show_error = true;
                return;
            } else {
                this.show_error = false;
            }

            const body = {
                camper: camper_id,
                monto: this.monto,
                fecha_pago: new Date()
            }
            const response: AxiosResponse = await axios.post(this.baseUrl, body);

            if(response.data.status){
                this.camperDialog = false;
                this.camper = {};
                this.paymentSuccess();
            }
        } catch (error) {
            console.log(error);
        }
    }

    hideDialog = () => {
        this.camperDialog = false;
        this.show_error = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    deleteSelectedCampers() {
        this.deleteCampersDialog = true;
    }

    deleteCamper(camper: Camper) {
        this.deleteCamperDialog = true;
        this.camper = { ...camper };
    }

    paymentSuccess = () => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            text: 'Pago Registrado!',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000
        });
    }

    deleteSuccess = () => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            text: 'Registro Eliminado',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000
        });
    }

    confirmDeleteSelected = async () => {
        this.deleteCampersDialog = false;
        const ids: String[] = [];
        this.selectedCampers.forEach((camper: Camper) => {
            ids.push(camper._id);
        });
        
        const query = ids.join(',');

        const response: boolean = await deleteCampers(query);

        if(response){
            this.deleteSuccess();
            this.updateData();
            this.selectedCampers = []
        }
    }

    updateData = () => {
        this.ngOnInit();
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
