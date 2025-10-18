import { format as formatDateFns } from 'date-fns';

export class DateUtils {
  static formatDateTime(date: Date): string | undefined {
    if (!date) {
      return undefined;
    }
    return date.toISOString();
  }

  static formatDate(date: Date, format: string = 'yyyy-MM-dd'): string {
    if (!date) {
      return '';
    }
    return formatDateFns(date, format);
  }
}
