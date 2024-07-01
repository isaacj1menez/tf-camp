import { Component } from '@angular/core';
import { deleteCampers, getCamperbyRegisterNumber, getCampers, getPayments } from 'src/app/services/tf-camp-api.service';
import { formatMongoDate } from 'src/app/utils/common';
import { Camper, GetCampersResponse } from 'src/app/interfaces/camper-responses.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import axios, { AxiosResponse } from 'axios';
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [ConfirmationService, MessageService]
})
export class DashboardComponent {

    payments = [];

    baseUrl: string = 'http://localhost:2250/api/payments';

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
            { field: 'sexo', header: 'Sexo' },
            { field: 'telefono', header: 'Télefono' },
            { field: 'iglesia', header: 'Iglesia' },
            { field: 'contacto', header: 'Contacto' },
            { field: 'nombre_contacto', header: 'Nombre del Contacto' },
            { field: 'telefono_contacto', header: 'Teléfono del Contacto' },
            { field: 'talla', header: 'Talla' },
            { field: 'alergias', header: 'Alergias' },
            { field: 'tipo_sangre', header: 'Tipo de Sangre' },
            { field: 'medicamentos', header: 'Medicamentos' },
            { field: 'comentarios', header: 'Comentarios' },
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

            if (this.monto <= 0) {
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

            if (response.data.status) {
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

    async exportPayments() {
        // Procesar datos para la primera hoja
        const result = await getPayments();
        this.payments = result.data;
        const resumen = this.payments.reduce((acc, curr) => {
            const camper = acc.find(c => c.Nombre === curr.camper.nombre);
            if (camper) {
                camper.NumeroPagos++;
                camper.TotalAbonado += curr.monto;
                camper.Restante = Math.max(0, 1950 - camper.TotalAbonado);
            } else {
                acc.push({
                    Nombre: curr.camper.nombre,
                    NumeroPagos: 1,
                    TotalAbonado: curr.monto,
                    Restante: Math.max(0, 1950 - curr.monto)
                });
            }
            return acc;
        }, []);

        // Procesar datos para la segunda hoja
        const detalle = this.payments.map(item => ({
            Nombre: item.camper.nombre,
            FechaPago: new Date(item.fecha_pago).toLocaleDateString(),
            Monto: item.monto
        }));

        // Crear hojas de trabajo
        const resumenSheet = XLSX.utils.json_to_sheet(resumen);
        const detalleSheet = XLSX.utils.json_to_sheet(detalle);

        // Crear el libro de trabajo y agregar las hojas
        const workbook = {
            Sheets: {
                'Resumen': resumenSheet,
                'Detalle': detalleSheet
            },
            SheetNames: ['Resumen', 'Detalle']
        };

        // Generar el archivo Excel
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Guardar el archivo
        this.saveAsExcelFile(excelBuffer, 'Pagos_Camperos');
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, fileName + EXCEL_EXTENSION);
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

        if (response) {
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
