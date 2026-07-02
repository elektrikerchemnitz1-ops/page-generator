module.exports = function(block, renderComponent) {
  const label = block.label || "";
  const url = block.link && block.link.url ? block.link.url : "#";
  const activeClass = block.is_active ? "class=\"active\"" : "";
  return `
    <li><a href="${url}" ${activeClass}>${label}</a></li>
  `;
};
