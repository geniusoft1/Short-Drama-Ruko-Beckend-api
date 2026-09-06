# 🎬 Ruko Admin — Short Drama Aggregator System

A complete admin panel + backend API for the Ruko short drama streaming app. Aggregates content from multiple drama platforms and serves a unified API to your Ruko mobile app.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- npm

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment
```bash
# .env is already created from .env.example
# Edit it with your settings:
notepad .env   # (Windows)
nano .env      # (Linux)
```

Key settings:
- `JWT_SECRET` — Change this to a long random string!
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — Your login credentials
- `REELAPI_KEY` — Add your ReelAPI key when you get one

### 3. Initialize the database
```bash
npm run init-db
```
This creates `server/data/ruko.db` and seeds:
- Default admin user (`admin` / `Admin@Ruko123`)
- All 7 drama source entries
- A default API key for the Ruko app

### 4. Start the server
```bash
npm run dev    # Development (auto-restart)
# or
npm start      # Production
```

### 5. Open the Admin Panel
Visit: **http://localhost:3000/admin/**

Login with: `admin` / `Admin@Ruko123` *(change after first login!)*

---

## 📱 Connecting the Ruko Mobile App

### API Base URL
```
http://YOUR_SERVER_IP:3000/api/v1/
```

### Authentication
Add this header to every request:
```
x-api-key: ruko_your_api_key_here
```

Get your API key from: **Admin Panel → API Keys**

### Example Requests

```bash
# Get all drama sources
curl http://localhost:3000/api/v1/websites \
  -H "x-api-key: YOUR_KEY"

# Get dramas from a source
curl "http://localhost:3000/api/v1/website/1/dramas?page=1&limit=20" \
  -H "x-api-key: YOUR_KEY"

# Search dramas
curl "http://localhost:3000/api/v1/search?q=CEO" \
  -H "x-api-key: YOUR_KEY"

# Get episode with stream links
curl http://localhost:3000/api/v1/episode/1 \
  -H "x-api-key: YOUR_KEY"
```

---

## 🌐 API Endpoints (Public — for Ruko App)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/websites` | All active drama sources |
| GET | `/api/v1/website/:id` | Source details |
| GET | `/api/v1/website/:id/dramas` | Dramas from a source |
| GET | `/api/v1/drama/:id` | Full drama details |
| GET | `/api/v1/drama/:id/episodes` | Episodes list |
| GET | `/api/v1/episode/:id` | Episode + stream links |
| GET | `/api/v1/search?q=keyword` | Global search |
| GET | `/api/v1/trending` | Top rated dramas |
| GET | `/api/v1/latest` | Recently added |

Query params: `?page=1&limit=20&sort=latest/popular/rating`

---

## 🔌 Drama Sources

| Source | Type | Status | Notes |
|--------|------|--------|-------|
| **Demo Data** | Built-in | ✅ Ready | 6 demo dramas, works immediately |
| **ReelAPI** | Paid API | 🔑 Key needed | Contact via github.com/reelapi |
| **DramaBox** | Scraper | 🕷️ Auto | Scrapes public catalog |
| **FlickReels** | Scraper | 🕷️ Auto | Scrapes public catalog |
| **FlexTV** | Scraper | 🕷️ Auto | Scrapes public catalog |
| **DramaReels** | Scraper | 🕷️ Auto | Scrapes public catalog |
| **GoodShorts** | Scraper | 🕷️ Auto | Scrapes public catalog |

### Getting a ReelAPI Key
1. Visit: https://github.com/reelapi
2. Check their repositories for subscription links
3. They provide APIs for 20+ Chinese short drama platforms
4. Once you have a key, add it to `.env` as `REELAPI_KEY=your_key`
5. Enable ReelAPI in Admin Panel → Sources → Config

---

## 🖥️ Deploying to Contabo VPS

### 1. Upload files to VPS
```bash
# From your local machine:
scp -r ./ruko-admin root@YOUR_VPS_IP:/var/www/ruko-admin
```

### 2. SSH into VPS and run setup
```bash
ssh root@YOUR_VPS_IP
cd /var/www/ruko-admin/server
npm install --production
npm run init-db
npm install -g pm2
pm2 start src/index.js --name "ruko-admin"
pm2 save && pm2 startup
```

### 3. Setup Nginx
```bash
cp /var/www/ruko-admin/nginx.conf /etc/nginx/sites-available/ruko-admin
# Edit the file to replace YOUR_DOMAIN_OR_IP
nano /etc/nginx/sites-available/ruko-admin
ln -s /etc/nginx/sites-available/ruko-admin /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 4. (Optional) SSL with Let's Encrypt
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

Your admin panel will be at: `http://your-domain.com/admin/`  
Your API will be at: `http://your-domain.com/api/v1/`

---

## 🏗️ Project Structure

```
ruko-admin/
├── server/
│   ├── src/
│   │   ├── adapters/          ← One file per drama source
│   │   │   ├── mock.adapter.js
│   │   │   ├── reelapi.adapter.js
│   │   │   ├── dramabox.adapter.js
│   │   │   ├── flickreels.adapter.js
│   │   │   ├── flextv.adapter.js
│   │   │   └── index.js       ← Adapter registry
│   │   ├── config/
│   │   │   ├── database.js    ← SQLite setup
│   │   │   └── initDb.js      ← Seeding script
│   │   ├── middleware/
│   │   │   ├── auth.js        ← JWT validation
│   │   │   └── apiKeyAuth.js  ← API key validation
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── v1.routes.js   ← Public Ruko API
│   │   ├── services/
│   │   │   └── sync.service.js← Fetches & stores dramas
│   │   └── index.js           ← Express server entry
│   ├── data/
│   │   └── ruko.db            ← SQLite database (auto-created)
│   └── .env
└── admin/                      ← Web Admin Panel
    ├── index.html              ← Login page
    ├── dashboard.html          ← Dashboard
    ├── sources.html            ← Source management
    ├── dramas.html             ← Drama library
    ├── episodes.html           ← Episode manager
    ├── api-keys.html           ← API key manager
    ├── css/style.css           ← Design system
    └── js/
        ├── api.js             ← HTTP client
        └── auth.js            ← Auth utilities
```

---

## 🔧 Adding a New Adapter

1. Create `server/src/adapters/myplatform.adapter.js`:
```js
async function fetchDramas() {
  // Return array of drama objects
  return [{ id, title, description, poster, genre, ... }];
}
async function fetchEpisodes(dramaId) {
  // Return array of episode objects
  return [{ id, drama_id, episode_number, streams: [{quality, url}] }];
}
module.exports = { fetchDramas, fetchEpisodes, name: 'My Platform' };
```

2. Register in `server/src/adapters/index.js`:
```js
const myplatform = require('./myplatform.adapter');
const ADAPTERS = { ..., myplatform };
```

3. Add source to database via Admin Panel or `initDb.js`.

---

## 📜 License
MIT — For the Ruko App. Built with ❤️
