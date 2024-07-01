import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camper } from 'src/app/interfaces/camper-responses.interface';
import { getCamperbyRegisterNumber, getPaymentByCamperId } from 'src/app/services/tf-camp-api.service';

@Component({
    templateUrl: './inputdemo.component.html'
})
export class InputDemoComponent implements OnInit {

    camper: Camper;
    id: String = '';
    contacto: String = '';
    nombre: String = '';
    edad: String = '';
    sexo: String = '';
    telefono: String = '';
    talla: String = '';
    nombre_contacto: String = '';
    telefono_contacto: String = '';
    alergias: String[] = [];
    tipo_sangre: String = '';
    medicamentos: String[] = [];
    registro: String = '';
    fecha_registro: String = '';
    iglesia: String = '';
    comentarios: String = '';

    pieData: any;

    pieOptions: any;

    total_pice: number = 1950;

    total_payment: number = 0;

    payments: any = [];

    constructor(private router: ActivatedRoute) { }

    async ngOnInit() {
        const registro: string = this.router.snapshot.paramMap.get('registro');
        this.camper = await getCamperbyRegisterNumber(registro);
        this.payments = await getPaymentByCamperId(this.camper._id);
        this.id = this.camper._id;
        this.nombre = this.camper.nombre
        this.edad = this.camper.edad.toString();
        this.sexo = this.camper.sexo;
        this.telefono = this.camper.telefono;
        this.talla = this.camper.talla;
        this.nombre_contacto = this.camper.nombre_contacto;
        this.telefono_contacto = this.camper.telefono_contacto;
        this.alergias = this.camper.alergias;
        this.tipo_sangre = this.camper.tipo_sangre;
        this.medicamentos = this.camper.medicamentos;
        this.registro = this.camper.registro;
        this.fecha_registro = new Date(this.camper.fecha_registro).toLocaleDateString();
        this.iglesia = this.camper.iglesia;
        this.comentarios = this.camper.comentarios;

        this.getContacto(this.camper.contacto);

        this.totalPayment(this.payments);

        this.fillCahrt(this.total_pice, this.total_payment);
    }

    totalPayment = (payments: []) => {
        payments.forEach((pay: any) => {
            this.total_payment += pay.monto;
        });
    }

    fillCahrt = (total: number, partial: number) => {
        if(partial > 1950) partial = 1950;
        const documentStyle = getComputedStyle(document.documentElement);
        this.pieData = {
            labels: ['Por pagar','Abonado'],
            datasets: [
                {
                    data: [total - partial, partial],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--gray-200'),
                        documentStyle.getPropertyValue('--green-100'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--gray-200'),
                        documentStyle.getPropertyValue('--green-100'),
                    ]
                }
            ]
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'Pagos hechos',
                }
            }
        };
    }

    getContacto(contacto: String) {
        switch (contacto) {
            case 'M': this.contacto = 'Mamá'; break;
            case 'P': this.contacto = 'Papá'; break;
            case 'CG': this.contacto = 'Contacto General'; break;
        }
    }
}
