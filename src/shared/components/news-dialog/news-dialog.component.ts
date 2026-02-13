import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { NewsService } from '../../../service/news.service';

@Component({
  selector: 'app-news-dialog',
  imports: [SharedModule],
  templateUrl: './news-dialog.component.html',
  styleUrl: './news-dialog.component.scss',
})
export class NewsDialogComponent {
  service = inject(NewsService);

  onHide(): void {
    this.service.markAsSeenAndClose();
  }
}
