import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, Upload, Trash2 } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  available: boolean;
  calories?: number;
  stock?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null;
  categories: Category[];
}

export default function ProductModal({ isOpen, onClose, onSave, product, categories }: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    available: true,
    calories: undefined,
    stock: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  useEffect(() => {
    console.log('ProductModal montado:', { isOpen, product, categories });
    if (product) {
      setFormData(product);
      setImagePreview(product.image);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: categories[0]?.id || '',
        available: true,
        calories: undefined,
        stock: undefined,
      });
      setImagePreview(undefined);
    }
  }, [product, isOpen, categories]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setImagePreview(imageUrl);
      setFormData({ ...formData, image: imageUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Modo demonstração - simular salvamento
      if (token?.includes('demo-token')) {
        console.log('💾 Modo demo - simulando salvamento:', formData);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de rede
        
        const savedProduct = {
          ...formData,
          id: product?.id || `demo-${Date.now()}`,
          image: imagePreview || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
        };
        
        onSave(savedProduct);
        onClose();
        setIsLoading(false);
        return;
      }
      
      const url = product?.id ? `/api/products/${product.id}` : '/api/products';
      const method = product?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        onSave(savedProduct);
        onClose();
      } else {
        alert('Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" 
        style={{ backgroundColor: '#ffffff', zIndex: 100 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827', fontWeight: '600' }}>
              Imagem do Produto
            </label>
            <div className="flex items-start gap-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(undefined);
                      setFormData({ ...formData, image: undefined });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Clique para carregar uma imagem
                  </span>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827', fontWeight: '600' }}>
              Nome do Produto *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Ex: X-Bacon Deluxe"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827', fontWeight: '600' }}>
              Descrição *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              placeholder="Descreva os ingredientes e características do produto..."
              required
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827', fontWeight: '600' }}>
                Preço (R$) *
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827', fontWeight: '600' }}>
                Categoria *
              </label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827', fontWeight: '600' }}>
                Calorias (kcal)
              </label>
              <input
                type="number"
                id="calories"
                min="0"
                value={formData.calories || ''}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Ex: 650"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-900 mb-2" style={{ color: '#111827', fontWeight: '600' }}>
                Estoque (deixe vazio para ilimitado)
              </label>
              <input
                type="number"
                id="stock"
                min="0"
                value={formData.stock || ''}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Ex: 50"
              />
            </div>
          </div>

          {/* Available Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Produto disponível</p>
              <p className="text-sm text-gray-600">O produto será exibido no cardápio</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, available: !formData.available })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.available ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.available ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  {product ? 'Atualizar' : 'Criar'} Produto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

