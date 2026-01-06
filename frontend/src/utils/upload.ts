// Get API base URL from environment variable or use current origin
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  // @ts-ignore - Vite env variables
  const envUrl = import.meta.env?.VITE_API_URL;
  return envUrl || window.location.origin;
};

const API_BASE_URL = getApiBaseUrl();

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const token = localStorage.getItem('token');
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Rasm yuklashda xatolik');
  }

  const data = await response.json();
  return data.url;
};

export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '';
  // Если уже полный URL (http/https), возвращаем как есть
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Определяем базовый URL для изображений
  const baseUrl = API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  
  // Если начинается с /uploads, добавляем базовый URL
  if (imageUrl.startsWith('/uploads')) {
    return `${baseUrl}${imageUrl}`;
  }
  // Если просто путь без слеша, добавляем /uploads/
  if (!imageUrl.startsWith('/')) {
    return `${baseUrl}/uploads/${imageUrl}`;
  }
  // Иначе возвращаем с базовым URL
  return `${baseUrl}${imageUrl}`;
};

