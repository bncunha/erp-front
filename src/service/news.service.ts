import { Injectable, inject } from '@angular/core';
import { EMPTY, catchError, take } from 'rxjs';
import { LegalTermsService } from './legal-terms.service';
import { NewsApiService } from './api-service/news-api.service';
import { UserApiService } from './api-service/user-api.service';
import { NewsLatestResponse } from './responses/news-response';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private newsApiService = inject(NewsApiService);
  private userApiService = inject(UserApiService);
  private legalTermsService = inject(LegalTermsService);
  private sanitizer = inject(DomSanitizer);

  isDialogVisible = false;
  contentHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml('');
  currentNewsId: number | null = null;
  private pendingNews: NewsLatestResponse | null = null;

  constructor() {
    this.legalTermsService.accepted$.subscribe(() =>
      this.showPendingNewsIfAny(),
    );
  }

  checkLatestNewsAfterLogin(): void {
    if (!localStorage.getItem('token')) {
      return;
    }
    this.pendingNews = null;

    this.newsApiService
      .getLatest()
      .pipe(
        take(1),
        catchError(() => EMPTY),
      )
      .subscribe((latestNews) => {
        if (!latestNews) return;

        const savedId = this.getSavedNewsId();
        if (savedId === latestNews.id) {
          this.pendingNews = null;
          return;
        }

        if (this.legalTermsService.isDialogVisible) {
          this.pendingNews = latestNews;
          return;
        }

        this.openNews(latestNews);
      });
  }

  markAsSeenAndClose(): void {
    const storageKey = this.getStorageKey();
    if (storageKey && this.currentNewsId !== null) {
      localStorage.setItem(storageKey, String(this.currentNewsId));
    }

    this.isDialogVisible = false;
    this.contentHtml = '';
    this.currentNewsId = null;
  }

  private showPendingNewsIfAny(): void {
    if (!this.pendingNews || this.legalTermsService.isDialogVisible) {
      return;
    }
    this.openNews(this.pendingNews);
  }

  private openNews(news: NewsLatestResponse): void {
    this.pendingNews = null;
    this.currentNewsId = news.id;
    this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(
      news.content_html,
    );
    this.isDialogVisible = true;
  }

  private getSavedNewsId(): number | null {
    const storageKey = this.getStorageKey();
    if (!storageKey) {
      return null;
    }

    const value = localStorage.getItem(storageKey);
    if (!value) {
      return null;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private getStorageKey(): string | null {
    try {
      const userId = this.userApiService.getUserId();
      return `news:last-seen:${userId}`;
    } catch {
      return null;
    }
  }
}
