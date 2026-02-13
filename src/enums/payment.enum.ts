export enum PaymentEnum {
  PAID = 'PAID',
  PENDING = 'PENDING',
  CANCELLED = 'CANCEL',
  DELAYED = 'DELAYED',
  REVERSAL = 'REVERSAL',
}

export const GetPaymentColor = (payment: PaymentEnum) => {
  switch (payment) {
    case PaymentEnum.PAID:
      return 'green';
    case PaymentEnum.PENDING:
      return 'gold';
    case PaymentEnum.CANCELLED:
      return 'lightcoral';
    case PaymentEnum.DELAYED:
      return 'red';
    case PaymentEnum.REVERSAL:
      return 'orange';
  }
};

export const GetPaymentName = (payment: PaymentEnum) => {
  switch (payment) {
    case PaymentEnum.PAID:
      return 'Pago';
    case PaymentEnum.PENDING:
      return 'Pendente';
    case PaymentEnum.CANCELLED:
      return 'Cancelado';
    case PaymentEnum.DELAYED:
      return 'Atrasado';
    case PaymentEnum.REVERSAL:
      return 'Estornado';
  }
};

export const GetPaymentEnumListEditable = () => {
  return [
    {
      label: 'Pago',
      value: PaymentEnum.PAID,
    },
    {
      label: 'Pendente',
      value: PaymentEnum.PENDING,
    },
    {
      label: 'Cancelado',
      value: PaymentEnum.CANCELLED,
    },
  ];
};

export const GetPaymentEnumList = () => {
  return [
    {
      label: 'Pago',
      value: PaymentEnum.PAID,
    },
    {
      label: 'Pendente',
      value: PaymentEnum.PENDING,
    },
    {
      label: 'Cancelado',
      value: PaymentEnum.CANCELLED,
    },
    {
      label: 'Atrasado',
      value: PaymentEnum.DELAYED,
    },
  ];
};
