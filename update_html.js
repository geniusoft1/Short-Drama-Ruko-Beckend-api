const fs = require('fs');
const path = require('path');
const dir = './admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'settings.html' && f !== 'index.html');
files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf-8');
    if (!content.includes('settings.html')) {
        content = content.replace('<a href="/admin/api-keys.html"', '<a href="/admin/settings.html"><i class="bi bi-gear me-2"></i> Settings</a>\n                <a href="/admin/api-keys.html"');
        fs.writeFileSync(path.join(dir, f), content);
        console.log('Updated ' + f);
    }
});
