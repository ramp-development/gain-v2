export const getVariable = (varName: string, element: HTMLElement = document.documentElement) => {
  const computedStyle = getComputedStyle(element);
  const value = computedStyle.getPropertyValue(varName);

  if (value === '') return null;
  return parseFloat(value);
};
