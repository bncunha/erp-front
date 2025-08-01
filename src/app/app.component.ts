import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { ToastComponent } from '../shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, LoaderComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'erp-front';
}
