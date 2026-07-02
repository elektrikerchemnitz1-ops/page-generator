module.exports = function(block, renderComponent) {
  const descHtml = block.description ? `<div class="stat-desc">${block.description}</div>` : '';
  return `
    <div class="stat-item reveal">
        <div class="stat-number" data-target="${block.target_number}">0</div>
        <div class="stat-label">${block.label}</div>
        ${descHtml}
    </div>
  `;
};
