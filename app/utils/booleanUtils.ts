// frontend/src/utils/booleanUtils.ts

// Fonction pour convertir les valeurs boolean en 0/1
const convertBooleans = <T extends Record<string, unknown>>(
  data: Partial<T>,
): Partial<T> => {
  const convertedData = { ...data };
  for (const key in convertedData) {
    if (typeof convertedData[key] === 'boolean' || convertedData[key] === '') {
      console.log(`Converting ${key}:`, convertedData[key]);
      convertedData[key] = (convertedData[key] ? 1 : 0) as unknown as T[Extract<
        keyof T,
        string
      >];
    }
  }
  console.log('Converted Data:', convertedData);
  return convertedData;
};

export default convertBooleans;
