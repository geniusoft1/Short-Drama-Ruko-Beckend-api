const fs = require('fs');
const path = require('path');
const dir = './admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'settings.html' && f !== 'index.html');
files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf-8');
    if (!content.includes('settings.html')) {
        content = content.replace('<a href="api-keys.html" class="nav-item">', '<a href="settings.html" class="nav-item"><span class="nav-icon">⚙️</span> Settings</a>\n        <a href="api-keys.html" class="nav-item">');
        fs.writeFileSync(path.join(dir, f), content);
        console.log('Updated sidebar in ' + f);
    }
});
