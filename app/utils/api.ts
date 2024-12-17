// utils/api.ts
export const createDebouncedRequest = () => {
    let timeout: NodeJS.Timeout;
    let currentController: AbortController | null = null;

    return async (requestFn: () => Promise<any>, delay = 300) => {
      if (currentController) {
        currentController.abort();
      }

      currentController = new AbortController();

      return new Promise((resolve, reject) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          try {
            const result = await requestFn();
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            currentController = null;
          }
        }, delay);
      });
    };
  };