import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsDialogComponent } from './news-dialog.component';
import { NewsService } from '../../../service/news.service';

describe('NewsDialogComponent', () => {
  let component: NewsDialogComponent;
  let fixture: ComponentFixture<NewsDialogComponent>;
  let newsService: {
    isDialogVisible: boolean;
    contentHtml: string;
    markAsSeenAndClose: jasmine.Spy;
  };

  beforeEach(async () => {
    newsService = {
      isDialogVisible: true,
      contentHtml: '<h1>Atualizacao</h1>',
      markAsSeenAndClose: jasmine.createSpy('markAsSeenAndClose'),
    };

    await TestBed.configureTestingModule({
      imports: [NewsDialogComponent],
      providers: [{ provide: NewsService, useValue: newsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render html content when visible', () => {
    const content = fixture.nativeElement.querySelector('.news-dialog__content h1');
    expect(content?.textContent).toContain('Atualizacao');
  });

  it('should mark as seen when closed', () => {
    component.onHide();
    expect(newsService.markAsSeenAndClose).toHaveBeenCalled();
  });
});
