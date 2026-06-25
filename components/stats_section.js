module.exports = function(block, renderComponent) {
  const sectionBody = (block.body || []).map(renderComponent).join('');
  return `
    <section class="stats section">
      ${sectionBody}
    </section>
  `;
};