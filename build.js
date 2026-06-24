const fs = require('fs');
const path = require('path');

// 1. Настройки окружения и Storyblok
const STORYBLOK_TOKEN = process.env.STORYBLOK_TOKEN || '1bcEOJuTpDCPhqhWvXGlcwtt'; 
const SLUG = 'home'; 
const url = `https://api.storyblok.com/v2/cdn/stories/${SLUG}?token=${STORYBLOK_TOKEN}&version=draft`;

// 2. РЕКУРСИВНЫЙ РЕНДЕРЕР КОМПОНЕНТОВ (Сюда добавляются все новые секции)
function renderComponent(block) {
  if (!block) return '';

  switch (block.component) {
    
    // --- КОМПОНЕНТ: HEADER (Шапка сайта) ---
    case 'header':
      return `
        <header class="header" id="header">
          <div class="container nav-container">
            <a href="#home" class="logo">
              <svg viewBox="0 0 24 24"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm-1 14l3-5h-3v-3l-3 5h3v3z"/></svg>
              <span>${block.logo_text || 'DO'} <span class="logo-highlight">${block.logo_highlight || 'Elektrotechnik'}</span></span>
            </a>
            <nav>
              <ul class="nav-links">
                ${(block.links || []).map(link => `<li><a href="${link.url}">${link.label}</a></li>`).join('')}
              </ul>
            </nav>
          </div>
        </header>
      `;

    // --- УРОВЕНЬ 1: STATS SECTION (Обертка) ---
    case 'stats_section':
      // Перенаправляем рендер на внутренние элементы (например, stats_grid)
      const sectionBody = (block.body || []).map(renderComponent).join('');
      return `
        <section class="stats section">
          ${sectionBody}
        </section>
      `;

    // --- УРОВЕНЬ 2: STATS GRID (Сетка) ---
    case 'stats_grid':
      // Перенаправляем рендер на карточки (stat_item)
      const gridItems = (block.items || []).map(renderComponent).join('');
      return `
        <div class="container stats-grid">
          ${gridItems}
        </div>
      `;

    // --- УРОВЕНЬ 3: STAT_ITEM (Лист / Карточка) ---
    case 'stat_item':
      return `
        <div class="stat-item reveal">
          <div class="stat-number" data-target="${block.number || 0}">0</div>
          <div class="stat-label">${block.label || ''}</div>
          <div class="stat-desc">${block.description || ''}</div>
        </div>
      `;

    // --- КОМПОНЕНТ: FOOTER (Подвал сайта) ---
    case 'footer':
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

    // Дефолтный фолбек, если компонент не найден
    default:
      console.warn(`Предупреждение: Компонент "${block.component}" еще не описан в рендерере.`);
      return '';
  }
}

// 3. ГЛАВНЫЙ ЦИКЛ СБОРКИ СТАТИКИ
async function runBuild() {
  try {
    console.log('1. Запрашиваем структуру страницы из Storyblok CDN...');
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ошибка Storyblok API: ${response.status}`);
    const data = await response.json();

    // В Storyblok контент лежит в data.story.content.body (массив корневых секций)
    const pageBlocks = data.story.content.body || [];
    
    console.log('2. Читаем локальные ресурсы (CSS и JS)...');
    // Стили и скрипты лежат в корне или src вашего репозитория
    const cssPath = path.join(__dirname, 'style.css');
    const jsPath = path.join(__dirname, 'script.js');
    
    const cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '/* CSS не найден */';
    const jsContent = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '/* JS не найден */';

    console.log('3. Запускаем сборку HTML-дерева...');
    const mainHtmlContent = pageBlocks.map(renderComponent).join('');

    // Итоговый монолитный HTML-шаблон для максимального PageSpeed
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="DO Elektrotechnik GmbH - Автоматическая сборка Jamstack">
    <title>${data.story.name || 'DO Elektrotechnik GmbH'}</title>
    
    <style>
${cssContent}
    </style>
</head>
<body>

    ${mainHtmlContent}

    <script>
${jsContent}
    </script>
</body>
</html>
    `;

    console.log('4. Проверяем и создаем директорию dist/...');
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    // Записываем финальный файл, который подхватит ваш YAML
    fs.writeFileSync('dist/index.html', htmlTemplate.trim());
    console.log('🚀 Успешно! Монолитный index.html собран в dist/ и готов к FTPS-деплою.');

  } catch (error) {
    console.error('❌ Ошибка критического сбоя сборщика:', error.message);
    process.exit(1); 
  }
}

runBuild();