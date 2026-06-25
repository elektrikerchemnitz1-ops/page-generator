module.exports = function(block, renderComponent) {
  const gridItems = (block.items || []).map(renderComponent).join('');
  return `
    <div class="container stats-grid">
      ${gridItems}
    </div>
  `;
};