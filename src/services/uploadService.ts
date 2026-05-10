import { api } from './api';

export const uploadService = {
  uploadImage: async (uri: string, folder: string = 'general'): Promise<string> => {
    const formData = new FormData();
    
    // Extraer el nombre del archivo de la URI
    const filename = uri.split('/').pop() || 'upload.jpg';
    
    // Determinar el tipo de archivo (mime type)
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    // En React Native, el objeto del archivo debe tener esta estructura para FormData
    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);

    const { data } = await api.post(`/uploads/image?folder=${folder}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.url;
  },
};
