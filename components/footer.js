module.exports = function(block, renderComponent) {
  const brandHtml = (block.brand_slot || []).map(renderComponent).join("");
  const linkGroupsHtml = (block.link_groups_slot || []).map(renderComponent).join("");
  return `
    <footer class="footer">
        <div class="container footer-grid">
            ${brandHtml}
            ${linkGroupsHtml}
        </div>
        ${(block.bottom_slot || []).map(renderComponent).join("")}
    </footer>
  `;
};
