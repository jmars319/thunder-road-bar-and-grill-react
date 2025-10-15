/*
  Purpose:
  - Lightweight wrapper to report web vitals (performance metrics) to a
    logger or analytics provider. This is optional and safe to remove if not
    used.

  Usage:
  - Pass a function to `reportWebVitals` (for example `console.log` or a
    custom analytics sender) to collect CLS, FID, FCP, LCP and TTFB.
*/

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
