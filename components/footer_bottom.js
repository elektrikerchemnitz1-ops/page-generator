module.exports = function(block, renderComponent) {
  const linksHtml = (block.links || []).map(renderComponent).join("");
  return `
    <div class="container footer-bottom">
        <div>
            ${block.copyright}
        </div>
        <div class="footer-bottom-links">
            ${linksHtml}
        </div>
    </div>
  `;
};
