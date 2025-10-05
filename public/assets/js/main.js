// Copied from PHP repo (trimmed)
// Main client-side JS helpers. Kept as a static file for now so existing inline behaviors continue to work.

console.log('public/assets/js/main.js loaded');

// Small helper to initialize form submission for non-PHP endpoints (this will be overridden by React components)
(function(){
  if (window.ModularFramework && window.ModularFramework.FormHandler) return;
  document.addEventListener('DOMContentLoaded', function(){
    console.log('Legacy main.js: DOMContentLoaded');
  });
})();
