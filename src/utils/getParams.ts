export const getParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
};
