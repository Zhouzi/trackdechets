/**
 * fallback to fn2 if fn1 fails
 */
 export function redundant(...fns) {
  return async (...args) => {
    let error = new Error(`Not found`);

    for (const fn of fns) {
      try {
        const response = await fn(...args);
        return response;
      } catch (err) {
        error = err;
      }
    }

    throw error;
  };
}
