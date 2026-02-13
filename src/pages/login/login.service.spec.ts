import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { AuthApiService } from '../../service/api-service/auth-api.service';
import { LegalTermsService } from '../../service/legal-terms.service';
import { BillingStatusStore } from '../../service/billing-status.store';
import { NewsService } from '../../service/news.service';

describe('LoginService', () => {
  let service: LoginService;
  let authApiService: jasmine.SpyObj<AuthApiService>;
  let router: jasmine.SpyObj<Router>;
  let legalTermsService: jasmine.SpyObj<LegalTermsService>;
  let billingStatusStore: jasmine.SpyObj<BillingStatusStore>;
  let newsService: jasmine.SpyObj<NewsService>;

  beforeEach(() => {
    authApiService = jasmine.createSpyObj<AuthApiService>('AuthApiService', ['login']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    legalTermsService = jasmine.createSpyObj<LegalTermsService>('LegalTermsService', ['checkPendingTerms']);
    billingStatusStore = jasmine.createSpyObj<BillingStatusStore>('BillingStatusStore', ['loadStatus']);
    newsService = jasmine.createSpyObj<NewsService>('NewsService', ['checkLatestNewsAfterLogin']);

    authApiService.login.and.returnValue(of({ token: 'token', name: 'Nome' }));
    billingStatusStore.loadStatus.and.returnValue(of(null));
    router.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        LoginService,
        { provide: AuthApiService, useValue: authApiService },
        { provide: Router, useValue: router },
        { provide: LegalTermsService, useValue: legalTermsService },
        { provide: BillingStatusStore, useValue: billingStatusStore },
        { provide: NewsService, useValue: newsService },
      ],
    });

    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login flow and load post-login data when form is valid', () => {
    const form = {
      valid: true,
      value: {
        username: 'bruno',
        password: '123',
      },
    } as NgForm;

    service.handleSubmit(form);

    expect(authApiService.login).toHaveBeenCalled();
    expect(legalTermsService.checkPendingTerms).toHaveBeenCalled();
    expect(newsService.checkLatestNewsAfterLogin).toHaveBeenCalled();
    expect(billingStatusStore.loadStatus).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not call login when form is invalid', () => {
    const form = {
      valid: false,
      value: {},
    } as NgForm;

    service.handleSubmit(form);

    expect(authApiService.login).not.toHaveBeenCalled();
    expect(legalTermsService.checkPendingTerms).not.toHaveBeenCalled();
    expect(newsService.checkLatestNewsAfterLogin).not.toHaveBeenCalled();
    expect(billingStatusStore.loadStatus).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
