import { format as formatDateFns } from 'date-fns';

export class DateUtils {
  static formatDate(date: Date, format: string = 'yyyy-MM-dd'): string {
    if (!date) {
      return '';
    }
    return formatDateFns(date, format);
  }
}
