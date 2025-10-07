import { Injectable } from '@angular/core';
import { GetSkuResponse } from '../../../service/responses/products-response';

@Injectable()
export class ItemsListService {
  filterByText(items: GetSkuResponse[], text: string): GetSkuResponse[] {
    if (!text) {
      return items;
    }
    return items.filter((item) => {
      const words = text.split(' ');
      return words.every((word) => {
        const values = Object.values(item).map((v) => String(v));
        return values.some((value) =>
          value.toLowerCase().includes(word.toLowerCase())
        );
      });
    });
  }
}
