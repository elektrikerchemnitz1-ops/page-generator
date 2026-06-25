const fs = require('fs');
const path = require('path');

// 1. Настройки окружения и Storyblok
const STORYBLOK_TOKEN = process.env.STORYBLOK_TOKEN || '1bcEOJuTpDCPhqhWvXGlcwtt'; 
const SLUG = 'home'; 
const url = `https://api.storyblok.com/v2/cdn/stories/${SLUG}?token=${STORYBLOK_TOKEN}&version=draft`;

// Папка, где хранятся шаблоны компонентов
const COMPONENTS_DIR = path.join(__dirname, 'components');

// 2. ДИНАМИЧЕСКИЙ РЕКУРСИВНЫЙ РЕНДЕРЕР КОМПОНЕНТОВ
function renderComponent(block) {
  if (!block || !block.component) return '';

  // Формируем путь к файлу компонента (например, ./components/header.js)
  const componentPath = path.join(COMPONENTS_DIR, `${block.component}.js`);

  try {
    // Проверяем, существует ли отдельный файл для этого компонента
    if (fs.existsSync(componentPath)) {
      // Динамически подключаем функцию рендеринга из файла
      const renderTemplate = require(componentPath);
      // Вызываем её, передавая сам блок данных и ссылку на renderComponent для рекурсии
      return renderTemplate(block, renderComponent);
    } else {
      console.warn(`Предупреждение: Файл для компонента "${block.component}" не найден по пути: ${componentPath}`);
      return '';
    }
  } catch (error) {
    console.error(`Ошибка при рендере компонента "${block.component}":`, error.message);
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

    const pageBlocks = data.story.content.body || [];
    
    console.log('2. Читаем локальные ресурсы (CSS и JS)...');
    const cssPath = path.join(__dirname, 'style.css');
    const jsPath = path.join(__dirname, 'script.js');
    
    const cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '/* CSS не найден */';
    const jsContent = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '/* JS не найден */';

    console.log('3. Запускаем сборку HTML-дерева...');
    const mainHtmlContent = pageBlocks.map(renderComponent).join('');

    // Итоговый монолитный HTML-шаблон
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

    fs.writeFileSync('dist/index.html', htmlTemplate.trim());
    console.log('🚀 Успешно! Монолитный index.html собран в dist/ и готов к FTPS-деплою.');

  } catch (error) {
    console.error('❌ Ошибка критического сбоя сборщика:', error.message);
    process.exit(1); 
  }
}

runBuild();