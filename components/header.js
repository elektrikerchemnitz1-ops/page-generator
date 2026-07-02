module.exports = function(block, renderComponent) {
  const logoHtml = (block.logo_slot || []).map(renderComponent).join("");
  const menuHtml = (block.menu_slot || []).map(renderComponent).join("");
  return `
    <header class="header" id="header">
        <div class="container nav-container">
            ${logoHtml}
            ${menuHtml}
            <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Menü öffnen">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>
  `;
};
