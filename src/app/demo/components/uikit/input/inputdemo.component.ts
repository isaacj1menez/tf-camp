import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Camper } from 'src/app/interfaces/camper-responses.interface';
import { getCamperbyRegisterNumber } from 'src/app/services/tf-camp-api.service';

@Component({
    templateUrl: './inputdemo.component.html'
})
export class InputDemoComponent implements OnInit{
    camper: Camper
    registerForm: FormGroup;

    constructor(private router: ActivatedRoute) {

    }

    async ngOnInit() {
        const registro: string = this.router.snapshot.paramMap.get('registro');
        this.camper = await getCamperbyRegisterNumber(registro);
        
        this.registerForm = new FormGroup({
            nombre: new FormControl(this.camper.nombre),
            edad: new FormControl(''),
            sexo: new FormControl('Sexo...'),
            telefono: new FormControl(''),
            iglesia: new FormControl(''),
            tipo_sangre: new FormControl('Tipo de Sangre...'),
            contacto: new FormControl('Contacto...'),
            nombre_contacto: new FormControl(''),
            telefono_contacto: new FormControl(''),
            talla: new FormControl('Talla de playera...'),
            alergias: new FormControl(''),
            medicamentos: new FormControl(''),
            comentarios: new FormControl('')
          });
    }
}
