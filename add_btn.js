const fs = require('fs');
let c = fs.readFileSync('admin/dramas.html', 'utf-8');
c = c.replace('<button type="button" class="btn btn-primary" onclick="saveDrama()">Save Changes</button>', '<button type="button" class="btn btn-warning" id="downloadDramaBtn"><i class="bi bi-cloud-arrow-down me-1"></i> Download to Bunny</button>\n                        <button type="button" class="btn btn-primary" onclick="saveDrama()">Save Changes</button>');
fs.writeFileSync('admin/dramas.html', c);
console.log('Button added.');
