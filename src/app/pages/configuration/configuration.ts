import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthServiceTs } from '../../core/services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-configuration',
  imports: [MatIconModule, RouterLink],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css',
})
export class Configuration {
  readonly currentUser = inject(AuthServiceTs).getCurrentUser();
}
