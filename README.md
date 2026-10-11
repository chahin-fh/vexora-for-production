# Vexora

## Production Deployment

### Rotate Credentials First

The Aiven database password and the current admin key were shared in chat. Rotate both before deployment. Store the new values only in Render environment settings; do not commit them or put them in `NEXT_PUBLIC_*` variables. If either value was ever committed, remove it from Git history as well as rotating it.

### Initialize Aiven MySQL

In Aiven, select the existing `defaultdb` database and run [`backend/batabase/schema.sql`](backend/batabase/schema.sql). The schema deliberately does not create or select a database, so it works with Aiven's assigned database. Confirm the Aiven service permits connections from the Render backend.

Set these Render environment variables on the backend service:

- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE=defaultdb`
- `MYSQL_SSL_CA`: the CA certificate downloaded from the Aiven service, including its PEM contents
- `ADMIN_API_KEY`: a newly generated, long random value
- `FRONTEND_URL=https://vexora-ivory.vercel.app`
- `UPLOAD_DIRECTORY=/var/data/products`

Configure the Render service with root directory `backend`, build command `npm ci`, start command `npm start`, and health check path `/api/health`. Attach a persistent disk mounted at `/var/data`; without persistent storage, uploaded product images can disappear on redeploy. `PORT` is assigned by Render.

### Deploy the Frontend

Configure Vercel with root directory `frontend` and set `BACKEND_API_URL=https://vexora-for-production.onrender.com` for the Production environment. The backend URL is server-side only; do not prefix it with `NEXT_PUBLIC_`. Redeploy after setting environment variables.

The admin dashboard uses the same `ADMIN_API_KEY` set on Render. Enter it on `/admin`; do not add it to Vercel or frontend source. Add products after the database schema has been initialized.

Local environment files are ignored by Git. Use [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example) as templates, then configure production values in the hosting platforms.
