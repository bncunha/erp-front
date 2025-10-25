enum InventoryTypeEnum {
  TRANSFER = 'TRANSFER',
  IN = 'IN',
  OUT = 'OUT',
}

export { InventoryTypeEnum };

export function getInventoryTypeLabel(type: InventoryTypeEnum | null): string {
  switch (type) {
    case InventoryTypeEnum.IN:
      return 'Entrada';
    case InventoryTypeEnum.OUT:
      return 'Saída';
    case InventoryTypeEnum.TRANSFER:
      return 'Transferência';
    default:
      return '-';
  }
}

export function getInventoryTypeColor(type: InventoryTypeEnum | null): string {
  switch (type) {
    case InventoryTypeEnum.IN:
      return '#16a34a'; // green-600
    case InventoryTypeEnum.OUT:
      return '#dc2626'; // red-600
    case InventoryTypeEnum.TRANSFER:
      return '#2563eb'; // blue-600
    default:
      return '#6b7280'; // gray-500 fallback
  }
}
