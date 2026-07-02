module.exports = function(block, renderComponent) {
  const itemsHtml = (block.items || []).map(renderComponent).join("");
  return `
    <section class="stats section">
        <div class="container stats-grid">
            ${itemsHtml}
        </div>
    </section>
  `;
};
