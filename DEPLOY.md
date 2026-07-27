# Deploying AgentStudio to agentstudio.tech

This guide replaces the current website on **agentstudio.tech** with the new
platform, on a standard Ubuntu VPS (20.04+), using Docker + Docker Compose
behind Nginx with a free Let's Encrypt certificate.

**What you end up with**

```
Internet ──HTTPS──▶ Nginx (host, port 443) ──▶ Next.js app (Docker, 127.0.0.1:3000)
                                                    │
                                                    ▼
                                              PostgreSQL (Docker, internal)
```

---

## 0. Prerequisites

- A VPS with root/sudo access and the `agentstudio.tech` DNS A record (and
  `www`) pointing at it.
- The project uploaded to the server (choose one):

```bash
# Option A — from your machine (run in the project folder):
rsync -avz --exclude node_modules --exclude .next --exclude .git . user@YOUR_SERVER_IP:/opt/agentstudio

# Option B — from a git remote, on the server:
sudo mkdir -p /opt/agentstudio && sudo chown $USER /opt/agentstudio
git clone YOUR_REPO_URL /opt/agentstudio
```

## 1. Install Docker (once)

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# log out & back in so the docker group applies
docker --version && docker compose version
```

## 2. Configure environment

```bash
cd /opt/agentstudio
cp .env.example .env
nano .env
```

Set at minimum:

| Variable | Value |
| --- | --- |
| `POSTGRES_PASSWORD` | a long random string (`openssl rand -hex 24`) |
| `NEXT_PUBLIC_APP_URL` | `https://agentstudio.tech` |
| `DATABASE_URL` | leave as-is — docker-compose builds it from the `POSTGRES_*` vars |

Optional but recommended:

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` | real sign-up/login (get keys at dashboard.clerk.com). **Without them the app runs in demo mode** — fully functional, but everyone shares one demo workspace. |
| `ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY` | real AI models. Without them agents use the built-in mock model. |
| `DEMO_USE_REAL_AI=true` | lets the public landing-page demo hit your real AI keys (off by default to protect your bill). |

> Clerk production keys are domain-bound: in the Clerk dashboard create a
> production instance for `agentstudio.tech` and follow its DNS instructions.

## 3. Build and start the stack

```bash
cd /opt/agentstudio
docker compose up -d --build
```

First build takes a few minutes. Check health:

```bash
docker compose ps                      # both services "running"
docker compose logs -f app             # look for "Starting AgentStudio on :3000"
curl -I http://127.0.0.1:3000          # HTTP/1.1 200 OK
```

The app container automatically creates/updates the database schema on start
(`prisma db push`), so there is no separate migration step.

## 4. Nginx + HTTPS

```bash
sudo apt-get update && sudo apt-get install -y nginx certbot python3-certbot-nginx

# Remove the old agentstudio.tech site config if one exists:
ls /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/OLD_SITE_CONFIG        # if applicable

sudo cp /opt/agentstudio/nginx/agentstudio.conf /etc/nginx/sites-available/agentstudio.conf
sudo ln -sf /etc/nginx/sites-available/agentstudio.conf /etc/nginx/sites-enabled/agentstudio.conf
```

Get certificates (this also fixes up the SSL lines in the config):

```bash
sudo certbot --nginx -d agentstudio.tech -d www.agentstudio.tech
sudo nginx -t && sudo systemctl reload nginx
```

> If certbot complains that the certificate paths in the config don't exist
> yet, comment out the two `ssl_certificate*` lines and the whole
> `server { listen 443 … }` block, reload nginx, run certbot, then restore.
> Certbot's `--nginx` mode normally handles everything in one go.

**Done.** https://agentstudio.tech now serves the new platform.

## 5. Updating the site later

```bash
cd /opt/agentstudio
git pull                       # or rsync the new code up
docker compose up -d --build   # rebuild + restart with ~seconds of downtime
```

## 6. Operations cheat-sheet

```bash
docker compose logs -f app         # tail app logs
docker compose logs -f db          # tail database logs
docker compose restart app         # restart just the app
docker compose down                # stop everything (data persists in volume)
docker compose down -v             # ⚠ stop AND DELETE the database volume

# Database backup / restore
docker compose exec db pg_dump -U agentstudio agentstudio > backup_$(date +%F).sql
cat backup_2026-01-01.sql | docker compose exec -T db psql -U agentstudio agentstudio
```

Set up a nightly backup cron:

```bash
crontab -e
# 3:30 AM daily, keep 14 days:
30 3 * * * cd /opt/agentstudio && docker compose exec -T db pg_dump -U agentstudio agentstudio | gzip > /opt/backups/agentstudio_$(date +\%F).sql.gz && find /opt/backups -name 'agentstudio_*.gz' -mtime +14 -delete
```

## 7. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `502 Bad Gateway` | `docker compose ps` — app container down? `docker compose logs app`. |
| App restarts in a loop with "Database not reachable" | Check `POSTGRES_PASSWORD` matches what the volume was initialized with. If you changed it, either restore the old value or `docker compose down -v` (destroys data!) and re-up. |
| Sign-in shows "Demo mode" | Clerk env vars missing at **build** time — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is baked into the bundle. Set it in `.env`, then `docker compose up -d --build`. |
| Agents reply with canned responses | No AI key configured — set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` and `docker compose up -d --build`. |
| Streaming replies arrive all at once | Ensure the nginx `location /` block keeps `proxy_buffering off`. |
| Changed a `NEXT_PUBLIC_*` var but nothing happened | Those are build-time values: rebuild with `docker compose up -d --build`. |

## Appendix: local development

```bash
npm install
cp .env.example .env          # keep DATABASE_URL="file:./dev.db"
npx prisma db push            # creates SQLite dev database
npm run dev                   # http://localhost:3000
```

No keys are required locally — demo auth + mock AI activate automatically.
