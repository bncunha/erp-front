import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  getStyle(variable: string): string {
    const style = window.getComputedStyle(document.body);
    return style.getPropertyValue(variable);
  }
}
