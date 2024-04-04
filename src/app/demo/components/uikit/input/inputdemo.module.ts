import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputDemoComponent } from './inputdemo.component';
import { InputDemoRoutingModule } from './inputdemo-routing.module';
import { ChipModule } from "primeng/chip";
import { DropdownModule } from "primeng/dropdown";
import { AccordionModule } from 'primeng/accordion';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		InputDemoRoutingModule,
		DropdownModule,
		ChipModule,
		AccordionModule,
		ChartModule,
		TableModule,
		ButtonModule
	],
	declarations: [InputDemoComponent]
})
export class InputDemoModule { }
