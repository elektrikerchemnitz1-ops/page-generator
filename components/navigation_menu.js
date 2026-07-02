module.exports = function(block, renderComponent) {
  const linksHtml = (block.links || []).map(renderComponent).join("");
  return `
    <nav>
        <ul class="nav-links" id="nav-links">
            ${linksHtml}
        </ul>
    </nav>
  `;
};
