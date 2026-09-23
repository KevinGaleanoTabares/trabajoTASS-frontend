import { Component } from '@angular/core';
import { ConflictTable } from '../components/conflict-table/conflict-table';


@Component({
  selector: 'app-directivos',
  imports: [ConflictTable],
  templateUrl: './directivos.html',
  styleUrl: './directivos.css',
})
export class Directivos {}
