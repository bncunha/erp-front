// loader.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  private requests = 0;

  show() {
    this.requests++;
    this.loading.next(true);
  }

  hide() {
    this.requests--;
    if (this.requests <= 0) {
      this.loading.next(false);
      this.requests = 0;
    }
  }
}
