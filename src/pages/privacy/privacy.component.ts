import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CardComponent } from '../../shared/components/card/card.component';
import { ActivatedRoute } from '@angular/router';
import { DocumentsApiService } from '../../service/api-service/documents-api.service';
import { catchError, EMPTY, finalize, map, of, switchMap } from 'rxjs';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [SharedModule, CardComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent implements OnInit {
  private documentsApi = inject(DocumentsApiService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);

  content: SafeHtml | null = null;
  version = '';
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const versionParam = params.get('v') || undefined;
        this.loadDocument(versionParam);
      });
  }

  private loadDocument(versionParam?: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.content = null;

    const version$ = versionParam
      ? of(versionParam)
      : this.documentsApi.getLastVersion('privacidade');

    version$
      .pipe(
        switchMap((version) =>
          this.documentsApi.getDocument('privacidade', version).pipe(
            map((markdown) => ({
              html: this.sanitizer.bypassSecurityTrustHtml(marked.parse(markdown)),
              version,
            }))
          )
        ),
        catchError(() => {
          this.errorMessage =
            'Versão solicitada não encontrada. Verifique o parâmetro "v" ou tente novamente mais tarde.';
          return EMPTY;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(({ html, version }) => {
        this.content = html;
        this.version = version;
      });
  }
}
