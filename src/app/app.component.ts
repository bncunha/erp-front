import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { LegalTermsDialogComponent } from '../shared/components/legal-terms-dialog/legal-terms-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    LoaderComponent,
    ToastComponent,
    LegalTermsDialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'erp-front';

  ngOnInit(): void {
  }
}
