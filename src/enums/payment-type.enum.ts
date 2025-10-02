export enum PaymentTypeEnum {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  CREDIT_STORE = 'CREDIT_STORE',
}

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
  }
};
