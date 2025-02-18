export const APP_NAME = 'Stacks On Chain Metrics';

const icon =
  typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '';

export const getAppDetails = () => {
  return { name: APP_NAME, icon };
};
