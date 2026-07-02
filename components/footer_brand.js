module.exports = function(block, renderComponent) {
  return `
    <div class="footer-brand">
        <a href="#home" class="logo">
            <svg viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm-1 14l3-5h-3v-3l-3 5h3v3z"/>
            </svg>
            <span>
                ${block.logo_text_main}
                <span class="logo-highlight">${block.logo_text_highlight || ''}</span>
            </span>
        </a>
        <p>${block.description}</p>
    </div>
  `;
};
