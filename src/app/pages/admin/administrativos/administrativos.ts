import { Component } from '@angular/core';
import { ConflictTable } from '../components/conflict-table/conflict-table';


@Component({
  selector: 'app-administrativos',
  imports: [ConflictTable],
  templateUrl: './administrativos.html',
  styleUrl: './administrativos.css',
})
export class Administrativos {}
