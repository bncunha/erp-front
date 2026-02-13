import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { LegalTermsService } from './legal-terms.service';
import { NewsApiService } from './api-service/news-api.service';
import { UserApiService } from './api-service/user-api.service';
import { NewsService } from './news.service';
import { NewsLatestResponse } from './responses/news-response';

class LegalTermsServiceStub {
  acceptedSubject = new Subject<void>();
  accepted$ = this.acceptedSubject.asObservable();
  isDialogVisible = false;
}

describe('NewsService', () => {
  let service: NewsService;
  let newsApiService: jasmine.SpyObj<NewsApiService>;
  let userApiService: jasmine.SpyObj<UserApiService>;
  let legalTermsService: LegalTermsServiceStub;

  const latestNews: NewsLatestResponse = {
    id: 123,
    content_html: '<h1>Novidade</h1>',
    created_at: '2026-02-12T10:00:00Z',
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'token');

    newsApiService = jasmine.createSpyObj<NewsApiService>('NewsApiService', ['getLatest']);
    userApiService = jasmine.createSpyObj<UserApiService>('UserApiService', ['getUserId']);
    legalTermsService = new LegalTermsServiceStub();

    userApiService.getUserId.and.returnValue(10);
    newsApiService.getLatest.and.returnValue(of(latestNews));

    TestBed.configureTestingModule({
      providers: [
        NewsService,
        { provide: NewsApiService, useValue: newsApiService },
        { provide: UserApiService, useValue: userApiService },
        { provide: LegalTermsService, useValue: legalTermsService },
      ],
    });

    service = TestBed.inject(NewsService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should open dialog when latest id differs from storage', () => {
    service.checkLatestNewsAfterLogin();

    expect(service.isDialogVisible).toBeTrue();
    expect(service.contentHtml).toBe('<h1>Novidade</h1>');
    expect(service.currentNewsId).toBe(123);
  });

  it('should not open dialog when latest id is already seen', () => {
    localStorage.setItem('news:last-seen:10', '123');

    service.checkLatestNewsAfterLogin();

    expect(service.isDialogVisible).toBeFalse();
    expect(service.currentNewsId).toBeNull();
  });

  it('should save seen id on close', () => {
    service.checkLatestNewsAfterLogin();
    service.markAsSeenAndClose();

    expect(localStorage.getItem('news:last-seen:10')).toBe('123');
    expect(service.isDialogVisible).toBeFalse();
    expect(service.currentNewsId).toBeNull();
  });

  it('should keep seen ids isolated per user', () => {
    service.currentNewsId = 1;
    service.isDialogVisible = true;
    userApiService.getUserId.and.returnValue(10);
    service.markAsSeenAndClose();

    service.currentNewsId = 2;
    service.isDialogVisible = true;
    userApiService.getUserId.and.returnValue(20);
    service.markAsSeenAndClose();

    expect(localStorage.getItem('news:last-seen:10')).toBe('1');
    expect(localStorage.getItem('news:last-seen:20')).toBe('2');
  });

  it('should defer dialog when legal terms dialog is visible and show it after accept', () => {
    legalTermsService.isDialogVisible = true;

    service.checkLatestNewsAfterLogin();

    expect(service.isDialogVisible).toBeFalse();
    legalTermsService.isDialogVisible = false;
    legalTermsService.acceptedSubject.next();

    expect(service.isDialogVisible).toBeTrue();
    expect(service.currentNewsId).toBe(123);
  });

  it('should not open dialog when request fails', () => {
    newsApiService.getLatest.and.returnValue(throwError(() => new Error('erro')));

    service.checkLatestNewsAfterLogin();

    expect(service.isDialogVisible).toBeFalse();
    expect(service.currentNewsId).toBeNull();
  });
});
