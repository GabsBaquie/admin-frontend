const convertBooleans = <T extends Record<string, unknown>>(
  data: Partial<T>
): Partial<T> => {
  const convertedData = { ...data };
  for (const key in convertedData) {
    if (typeof convertedData[key] === "boolean" || convertedData[key] === "") {
      convertedData[key] = (convertedData[key] ? 1 : 0) as unknown as T[Extract<
        keyof T,
        string
      >];
    }
  }
  return convertedData;
};

export default convertBooleans;
