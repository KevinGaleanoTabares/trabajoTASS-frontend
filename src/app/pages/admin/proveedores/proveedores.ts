import { Component } from '@angular/core';
import { ConflictTable } from '../components/conflict-table/conflict-table';

@Component({
  selector: 'app-proveedores',
  imports: [ConflictTable],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css',
})
export class Proveedores {}
