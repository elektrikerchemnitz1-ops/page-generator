module.exports = function(block, renderComponent) {
  return `
    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <h4 class="footer-title">${block.title || ''}</h4>
          <p>${block.text || ''}</p>
        </div>
      </div>
      <div class="container footer-bottom">
        <div>&copy; ${new Date().getFullYear()} ${block.copyright || ''}</div>
      </div>
    </footer>
  `;
};