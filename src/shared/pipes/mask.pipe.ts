import { Pipe, PipeTransform } from '@angular/core';

export type MaskTokenMap = Record<string, RegExp>;

export interface MaskOptions {
  /**
   * Tokens adicionais ou sobrescritos.
   * Ex.: { 'L': /[a-z]/, 'U': /[A-Z]/ }
   */
  tokens?: MaskTokenMap;

  /**
   * Se true, remove espaços no início/fim do valor mascarado (padrão: true)
   */
  trimResult?: boolean;

  /**
   * Se true, retorna string vazia quando não houver valor (padrão: false retorna o próprio valor)
   */
  emptyAsBlank?: boolean;
}

@Pipe({
  name: 'mask',
  standalone: true,
  // Deixe pure:true para performance; vai atualizar normalmente em detecção de mudanças.
  // Se você precisa mascarar a cada keypress e sentir atraso, considere uma directive.
  pure: true,
})
export class MaskPipe implements PipeTransform {
  private defaultTokens: MaskTokenMap = {
    '#': /\d/,
    A: /[a-zA-Z]/,
    X: /[a-zA-Z0-9]/,
    '*': /[\s\S]/, // qualquer caractere
  };

  transform(
    value: string | number | null | undefined,
    pattern: string,
    options?: MaskOptions
  ): string | null | undefined {
    if (value === null || value === undefined) {
      return options?.emptyAsBlank ? '' : value;
    }

    const str = String(value);
    if (!pattern || !str) {
      return options?.emptyAsBlank ? '' : str;
    }

    const tokens = { ...this.defaultTokens, ...(options?.tokens ?? {}) };

    // Pré-filtra caracteres de entrada: mantém apenas os que eventualmente podem casar em algum token
    const allowedUnion = this.buildAllowedUnion(tokens);
    const input = allowedUnion
      ? Array.from(str).filter((ch) => allowedUnion.test(ch))
      : Array.from(str);

    let i = 0; // índice no input filtrado
    let out = '';
    let escaping = false;

    for (let p = 0; p < pattern.length; p++) {
      const pc = pattern[p];

      // Escape com '\': força literal mesmo se for token
      if (!escaping && pc === '\\') {
        escaping = true;
        continue;
      }

      if (!escaping && tokens[pc]) {
        // Consumir próximo caractere do input que casa com o token
        const rx = tokens[pc];
        let taken: string | null = null;

        while (i < input.length) {
          const ch = input[i++];
          if (rx.test(ch)) {
            taken = ch;
            break;
          }
        }

        if (taken === null) {
          // Faltou caractere para este token -> paramos a máscara aqui
          break;
        }
        out += taken;
      } else {
        // Literal
        out += pc;
      }
      escaping = false;
    }

    if (options?.trimResult !== false) {
      out = out.trim();
    }
    return out;
  }

  /** Constrói uma RegExp que é a união de todos tokens (para pré-filtragem leve do input). */
  private buildAllowedUnion(tokens: MaskTokenMap): RegExp | null {
    try {
      const parts: string[] = [];
      for (const k of Object.keys(tokens)) {
        const source = tokens[k].source;
        // envolve cada source em grupo não-capturante e remove âncoras se houver
        const sanitized = source.replace(/^\^|\$$/g, '');
        parts.push(`(?:${sanitized})`);
      }
      return parts.length ? new RegExp(parts.join('|')) : null;
    } catch {
      return null;
    }
  }
}
