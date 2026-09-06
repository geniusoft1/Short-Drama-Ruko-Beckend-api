const fs = require('fs');
const path = require('path');
const dir = './admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'downloads.html' && f !== 'index.html');
files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf-8');
    if (!content.includes('downloads.html')) {
        content = content.replace('<a href="episodes.html" class="nav-item"><span class="nav-icon">📺</span> Episodes</a>', '<a href="episodes.html" class="nav-item"><span class="nav-icon">📺</span> Episodes</a>\n        <a href="downloads.html" class="nav-item"><span class="nav-icon">📥</span> Downloads</a>');
        
        // Handle active state
        if (f === 'dramas.html') {
            content = content.replace('<a href="dramas.html" class="nav-item"><span class="nav-icon">🎭</span> Dramas</a>', '<a href="dramas.html" class="nav-item active"><span class="nav-icon">🎭</span> Dramas</a>');
        }
        
        fs.writeFileSync(path.join(dir, f), content);
        console.log('Updated sidebar in ' + f);
    }
});
