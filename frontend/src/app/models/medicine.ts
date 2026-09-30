export interface Medicine {
  medicineId: number;
  name: string;
  stockQuantity: number;
  price: number;
  lowStockThreshold: number;
}