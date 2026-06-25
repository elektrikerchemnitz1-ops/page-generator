module.exports = function(block, renderComponent) {
  return `
    <div class="stat-item reveal">
      <div class="stat-number" data-target="${block.number || 0}">0</div>
      <div class="stat-label">${block.label || ''}</div>
      <div class="stat-desc">${block.description || ''}</div>
    </div>
  `;
};