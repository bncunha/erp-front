export enum PaymentTypeEnum {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  CREDIT_STORE = 'CREDIT_STORE',
  PAYMENT_RETURN = 'PAYMENT_RETURN',
}

export interface PaymentList {
  value: PaymentTypeEnum;
  label: string;
  icon: string;
}

export const GetPaymentIcon = (payment: PaymentTypeEnum) => {
  return GetPaymentTypeList().find(
    (item: PaymentList) => item.value === payment
  )?.icon;
};

export const GetPaymentTypeNmae = (paymentType: PaymentTypeEnum) => {
  switch (paymentType) {
    case PaymentTypeEnum.CASH:
      return 'Dinheiro';
    case PaymentTypeEnum.CREDIT_CARD:
      return 'Cartão de Crédito';
    case PaymentTypeEnum.DEBIT_CARD:
      return 'Cartão de Débito';
    case PaymentTypeEnum.PIX:
      return 'PIX';
    case PaymentTypeEnum.CREDIT_STORE:
      return 'Notinha';
    case PaymentTypeEnum.PAYMENT_RETURN:
      return 'Devolução';
    default:
      return paymentType;
  }
};

export const GetPaymentTypeList = (): PaymentList[] => {
  return [
    { value: PaymentTypeEnum.CASH, label: 'Dinheiro', icon: 'money.png' },
    {
      value: PaymentTypeEnum.CREDIT_CARD,
      label: 'Cartão de Crédito',
      icon: 'credit_card.png',
    },
    {
      value: PaymentTypeEnum.DEBIT_CARD,
      label: 'Cartão de Débito',
      icon: 'debit_card.png',
    },
    { value: PaymentTypeEnum.PIX, label: 'PIX', icon: 'pix.png' },
    {
      value: PaymentTypeEnum.CREDIT_STORE,
      label: 'Notinha',
      icon: 'notinha.png',
    },
  ];
};
