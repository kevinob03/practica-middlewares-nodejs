const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const clients = new Map();

function rateLimit(req, res, next) {
  const now = Date.now();
  const ip = req.ip;
  let record = clients.get(ip);

  if (!record || now >= record.resetAt) {
    record = { count: 0, resetAt: now + WINDOW_MS };
    clients.set(ip, record);
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Límite de 10 peticiones por minuto superado' });
  }
  return next();
}

module.exports = rateLimit;
