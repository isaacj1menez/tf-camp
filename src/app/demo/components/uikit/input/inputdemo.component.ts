import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camper } from 'src/app/interfaces/camper-responses.interface';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { getCamperbyRegisterNumber } from 'src/app/services/tf-camp-api.service';
import { formatRegister } from 'src/app/utils/common';

@Component({
    templateUrl: './inputdemo.component.html'
})
export class InputDemoComponent implements OnInit {

    camper: Camper;
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

    constructor(private router: ActivatedRoute, public layoutService: LayoutService) { }

    async ngOnInit() {
        const registro: string = this.router.snapshot.paramMap.get('registro');
        this.camper = await getCamperbyRegisterNumber(registro);
        this.getContacto(this.camper.contacto);
        this.nombre = this.camper.nombre
        this.edad = this.camper.edad.toString();
        this.sexo = this.camper.sexo;
        this.telefono = this.camper.telefono;
        this.talla = this.camper.talla;
        this.contacto = this.camper.contacto;
        this.nombre_contacto = this.camper.nombre_contacto;
        this.telefono_contacto = this.camper.telefono_contacto;
        this.alergias = this.camper.alergias;
        this.tipo_sangre = this.camper.tipo_sangre;
        this.medicamentos = this.camper.medicamentos;
        this.registro = this.camper.registro;
        this.fecha_registro = this.camper.fecha_registro;
        this.iglesia = this.camper.iglesia;
        this.comentarios = this.camper.comentarios;
    }

    
    getRegister = (registro: String) => {
        return formatRegister(registro);
    }

    getContacto(contacto: String) {
        switch (contacto) {
            case 'M': this.contacto = 'Mamá'; break;
            case 'P': this.contacto = 'Papá'; break;
            case 'CG': this.contacto = 'Contacto General'; break;
        }
    }
}
