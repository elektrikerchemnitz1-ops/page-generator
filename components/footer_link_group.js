module.exports = function(block, renderComponent) {
  const linksHtml = (block.links || []).map(renderComponent).join("");
  return `
    <div>
        <h4 class="footer-links-title">${block.title}</h4>
        <ul class="footer-links-list">
            ${linksHtml}
        </ul>
    </div>
  `;
};
