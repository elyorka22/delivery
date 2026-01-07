// Get API base URL from environment variable or use current origin
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  // In development, use relative path (Vite proxy will handle it)
  return '';
};

const API_BASE_URL = getApiBaseUrl();

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const token = localStorage.getItem('token');
  const apiUrl = API_BASE_URL || '/api';
  const response = await fetch(`${apiUrl}/upload`, {
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

