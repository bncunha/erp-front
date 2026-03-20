export enum QuoteShippingTypeEnum {
  FREE = 'FREE',
  FREE_REGION = 'FREE_REGION',
  FREE_MIN_VALUE = 'FREE_MIN_VALUE',
  TO_CALCULATE = 'TO_CALCULATE',
}

export const QuoteShippingTypeOptions = [
  { label: 'Frete grátis', value: QuoteShippingTypeEnum.FREE },
  { label: 'Frete grátis por região', value: QuoteShippingTypeEnum.FREE_REGION },
  { label: 'Frete grátis por valor mínimo', value: QuoteShippingTypeEnum.FREE_MIN_VALUE },
  { label: 'Frete a calcular', value: QuoteShippingTypeEnum.TO_CALCULATE },
];
