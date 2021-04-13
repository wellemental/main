type GenericObj = { [key: string]: any };

export const compareObjects = (obj1: GenericObj, obj2: GenericObj): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};
