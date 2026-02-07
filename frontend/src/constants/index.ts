
import { Product } from '../types';

export const MENU_ITEMS: Product[] = [
  // COMBOS
  {
    id: 'c1',
    name: 'Combo Individual Prime',
    description: '1 Gemini Prime + 1 Batata Rústica Individual + 1 Refrigerante Lata.',
    price: 58.00,
    category: 'combos',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800',
    tags: ['Econômico']
  },
  {
    id: 'c2',
    name: 'Combo Casal Smash',
    description: '2 Super Flash Smash + 1 Batata Rústica Grande + 2 Refrigerantes Lata.',
    price: 89.90,
    category: 'combos',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    tags: ['Promoção']
  },
  {
    id: 'c3',
    name: 'Combo Família Monster',
    description: '4 Burgers (2 Prime, 2 Smash) + 2 Porções de Batata + 1 Coca-Cola 2L.',
    price: 159.00,
    category: 'combos',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800',
    tags: ['Família']
  },

  // BURGERS
  {
    id: 'b1',
    name: 'Gemini Prime',
    description: 'Blend bovino 180g, queijo cheddar artesanal, cebola caramelizada e maionese trufada no pão brioche.',
    price: 38.90,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    tags: ['Best Seller']
  },
  {
    id: 'b6',
    name: 'Truffle Gorgonzola',
    description: 'Hambúrguer 180g, creme de gorgonzola premium, mel trufado e rúcula fresca.',
    price: 45.00,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=800',
    tags: ['Gourmet']
  },
  {
    id: 'b7',
    name: 'Monster Double Stack',
    description: 'Dois burgers de 180g, quatro fatias de cheddar, bacon duplo e pão australiano.',
    price: 52.00,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&q=80&w=800',
    tags: ['Para Fortes']
  },
  {
    id: 'b2',
    name: 'Super Flash Smash',
    description: 'Dois burgers smash 90g, double cheddar, picles da casa e molho especial.',
    price: 29.90,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800'
  },

  // SIDES
  {
    id: 's1',
    name: 'Batata Rústica Grande',
    description: 'Batatas com casca temperadas com alecrim, páprica e sal grosso. Acompanha maionese verde.',
    price: 22.00,
    category: 'sides',
    image: 'https://png.pngtree.com/png-vector/20250813/ourlarge/pngtree-golden-brown-rustic-potato-wedges-served-with-spices-on-vivid-orange-png-image_16719846.png'
  },
  {
    id: 's4',
    name: 'Batata com Cheddar e Bacon',
    description: 'Nossa batata rústica coberta com muito molho cheddar e farofa de bacon.',
    price: 28.00,
    category: 'sides',
    image: '/batata-com-cheddar.png'
  },

  // DRINKS (NON-ALCOHOLIC)
  {
    id: 'd3',
    name: 'Coca-Cola 350ml',
    description: 'Lata gelada.',
    price: 7.00,
    category: 'drinks',
    image: '/02.png'
  },
  {
    id: 'd6',
    name: 'Água Mineral c/ Gás',
    description: 'Garrafa 500ml gelada com rodelas de limão.',
    price: 5.00,
    category: 'drinks',
    image: '/agua.jpg'
  },

  // ALCOHOLIC DRINKS
  {
    id: 'a1',
    name: 'Chopp IPA Artesanal',
    description: 'Copo de 500ml. Cerveja encorpada com notas cítricas e amargor marcante.',
    price: 24.00,
    category: 'alcohol',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800',
    tags: ['Local']
  },
  {
    id: 'a2',
    name: 'Gin Tônica Clássica',
    description: 'Gin premium, tônica, zimbro e uma rodela de limão siciliano.',
    price: 28.00,
    category: 'alcohol',
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'a3',
    name: 'Heineken Long Neck',
    description: 'Cerveja Premium Lager 330ml gelada.',
    price: 12.00,
    category: 'alcohol',
    image: '/heineken.png'
  },
  {
    id: 'a4',
    name: 'Caipirinha de Morango',
    description: 'Morangos frescos, açúcar e cachaça premium ou vodka.',
    price: 22.00,
    category: 'alcohol',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800'
  },

  // DESSERTS
  {
    id: 'e1',
    name: 'Milkshake Nutella',
    description: 'Sorvete de baunilha, muita Nutella e chantilly artesanal.',
    price: 24.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800'
  }
];

export const WHATSAPP_NUMBER = '12997775889';
