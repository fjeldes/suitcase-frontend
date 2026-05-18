import { api } from './api';
import * as ImageManipulator from 'expo-image-manipulator';

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const COMPRESSION_QUALITY = 0.6;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

async function compressImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_WIDTH, height: MAX_HEIGHT } }],
    { compress: COMPRESSION_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

export const uploadService = {
  uploadImage: async (uri: string, folder: string = 'general'): Promise<string> => {
    const compressedUri = await compressImage(uri);

    const formData = new FormData();
    const filename = compressedUri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('file', {
      uri: compressedUri,
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
