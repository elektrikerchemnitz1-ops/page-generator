module.exports = function(block, renderComponent) {
  const targetNumber = block.target_number || "0";
  const label = block.label || "";
  const description = block.description || "";

  return `
    <div class="stat-item reveal">
        <div class="stat-number" data-target="${targetNumber}">0</div>
        <div class="stat-label">${label}</div>
        <div class="stat-desc">${description}</div>
    </div>
  `;
};