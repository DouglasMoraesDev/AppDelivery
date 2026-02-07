
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MENU_ITEMS } from "../constants";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const getAIRecommendation = async (userPreference: string): Promise<string> => {
  // Recomendações baseadas em palavras-chave enquanto a IA não funciona
  const pref = userPreference.toLowerCase();
  
  if (pref.includes('barato') || pref.includes('econômico') || pref.includes('promoção')) {
    return "💰 Para economia, recomendo o **Combo Individual Prime** (R$ 58,00) - completo e delicioso! Ou o **Super Flash Smash** (R$ 29,90) que é um sucesso!";
  }
  
  if (pref.includes('carne') || pref.includes('hamburguer') || pref.includes('burger')) {
    return "🍔 Recomendo o **Gemini Prime** (R$ 38,90) - nosso best seller! Ou para os mais famintos, o **Monster Double Stack** (R$ 52,00) com duplo de tudo!";
  }
  
  if (pref.includes('família') || (pref.includes('familia') || pref.includes('grupo') || pref.includes('muito'))) {
    return "👨‍👩‍👧‍👦 Perfeito para vocês: **Combo Família Monster** (R$ 159,00) - 4 burgers, 2 porções de batata e refrigerante 2L!";
  }
  
  if (pref.includes('gourmet') || pref.includes('especial') || pref.includes('diferente')) {
    return "✨ Experimente o **Truffle Gorgonzola** (R$ 45,00) - sofisticado com mel trufado! E que tal acompanhar com um **Chopp IPA Artesanal**?";
  }
  
  if (pref.includes('cerveja') || pref.includes('bebida') || pref.includes('drink')) {
    return "🍺 Temos **Chopp IPA Artesanal** (R$ 24,00) fresquinho, **Heineken** (R$ 12,00) ou uma **Caipirinha de Morango** (R$ 22,00) deliciosa!";
  }
  
  // Recomendação padrão
  return "🍔 Recomendo nosso **Gemini Prime** (R$ 38,90) - é o favorito da casa! E para completar, uma **Batata Rústica Grande** (R$ 22,00) crocante e temperada!";
};
