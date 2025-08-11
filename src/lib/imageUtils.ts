/**
 * Utility functions for handling images in the application
 */

/**
 * Converts a File object to a Base64 string
 * @param file - The File object to convert
 * @returns A Promise that resolves to the Base64 string representation of the file
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Takes only the first image from an array of images, converts it to Base64, and returns it
 * @param images - Array of File objects or existing Base64 strings
 * @returns A Promise that resolves to a Base64 string of the first image, or an empty string if no images
 */
export const getFirstImageAsBase64 = async (images: (File | string)[]): Promise<string> => {
  // If no images, return empty string
  if (!images || !Array.isArray(images) || images.length === 0) {
    return "";
  }
  
  // Get the first item from the array
  const firstImage = images[0];
  
  // If it's already a string (assuming it's a Base64 string), return it
  if (typeof firstImage === 'string') {
    return firstImage;
  }
  
  // If it's a File object, convert it to Base64
  if (firstImage instanceof File) {
    return await fileToBase64(firstImage);
  }
  
  // If it's neither a string nor a File, return empty string
  return "";
};