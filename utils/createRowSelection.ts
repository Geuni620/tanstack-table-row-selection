export const createRowSelection = (data: any[]): Record<number, boolean> => {
  return data.reduce((acc, el) => {
    if (el.done) {
      acc[el.id - 1] = el.done;
    }
    return acc;
  }, {});
};
