import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsFormDialogComponent } from './items-form-dialog.component';

describe('ItemsFormDialogComponent', () => {
  let component: ItemsFormDialogComponent;
  let fixture: ComponentFixture<ItemsFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
