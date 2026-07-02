module.exports = function(block, renderComponent) {
  const url = block.link?.url || "#";
  return `
    <li>
        <a href="${url}">
            ${block.label}
        </a>
    </li>
  `;
};
