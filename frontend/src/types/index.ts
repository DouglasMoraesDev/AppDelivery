
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'burgers' | 'sides' | 'drinks' | 'desserts' | 'combos' | 'alcohol';
  image: string;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
}

export type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro';

export interface OrderDetails {
  customerName: string;
  phone: string;
  isDelivery: boolean;
  zipCode: string;
  street: string;
  district: string;
  number: string;
  complement: string;
  referencePoint: string;
  coords?: { lat: number; lng: number };
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
  cashValue?: string;
  needsChange?: boolean;
  notes?: string;
}
