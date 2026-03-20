export enum QuoteStatusEnum {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
}

export function getQuoteStatusOptions(): {
  label: string;
  value: QuoteStatusEnum;
}[] {
  return Object.values(QuoteStatusEnum).map((status) => ({
    label: getQuoteStatusLabel(status),
    value: status,
  }));
}

export function getQuoteStatusLabel(status?: string | null): string {
  switch ((status || '').toUpperCase()) {
    case QuoteStatusEnum.DRAFT:
      return 'Rascunho';
    case QuoteStatusEnum.SENT:
      return 'Enviado';
    case QuoteStatusEnum.APPROVED:
      return 'Aprovado';
    case QuoteStatusEnum.REJECTED:
      return 'Rejeitado';
    case QuoteStatusEnum.EXPIRED:
      return 'Expirado';
    case QuoteStatusEnum.CANCELED:
      return 'Cancelado';
    default:
      return status || '-';
  }
}

export function getQuoteStatusClass(status?: string | null): string {
  switch ((status || '').toUpperCase()) {
    case QuoteStatusEnum.APPROVED:
      return 'table-badge--success';
    case QuoteStatusEnum.REJECTED:
    case QuoteStatusEnum.CANCELED:
      return 'table-badge--danger';
    case QuoteStatusEnum.SENT:
      return 'table-badge--info';
    case QuoteStatusEnum.EXPIRED:
      return 'table-badge--warning';
    default:
      return 'table-badge--neutral';
  }
}
