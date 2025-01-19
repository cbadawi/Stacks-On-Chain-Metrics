const maxRows = 30;

const validateData = (
  chartData: any[]
): { isValid: boolean; message: string } => {
  if (!Array.isArray(chartData) || chartData.length === 0) {
    return { isValid: false, message: 'Input data must be a non-empty array.' };
  }

  const keys = Object.keys(chartData[0]);

  if (keys.length < 2) {
    return {
      isValid: false,
      message: 'Each object must have at least two keys.',
    };
  }

  const [key1, key2] = keys;

  for (const item of chartData) {
    const itemKeys = Object.keys(item);
    if (
      itemKeys.length !== keys.length ||
      !itemKeys.every((key) => keys.includes(key))
    ) {
      return {
        isValid: false,
        message: 'All objects must have the same keys.',
      };
    }
    // allow undefined
    if (item[key2] && typeof item[key2] !== 'number') {
      return {
        isValid: false,
        message: `All values for the key \"${key2}\" must be numbers.`,
      };
    }
  }

  if (chartData.length > maxRows)
    return {
      isValid: false,
      message: `Too many data points. Please group your data into fewer categories (<${maxRows}) for a Pie Chart visualization.`,
    };

  return { isValid: true, message: 'Data is valid.' };
};

// const data = [
//   { category: 'A', value: 10 },
//   { category: 'B', value: 'ssss' },
//   { category: 'C', value: undefined },
// ];

// const validation = validateData(data);
// console.log(validation);

export default validateData;
