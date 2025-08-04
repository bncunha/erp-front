import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EMPTY, Observable, of } from 'rxjs';
import { CreateSkuRequest } from '../../../service/requests/skus-request';

export class SubmitSkuResponse {
  submited: boolean = false;
  request!: CreateSkuRequest;
}

@Injectable()
export class SkuFormDialogService {
  submitForm(
    ngForm: NgForm,
    productId?: number
  ): Observable<SubmitSkuResponse> {
    if (ngForm.valid) {
      const request = new CreateSkuRequest().parseToRequest(ngForm.value);
      if (!productId) {
        return of({
          submited: false,
          request,
        });
      }
    }
    return EMPTY;
  }
}
