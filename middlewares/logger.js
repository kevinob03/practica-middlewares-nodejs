function logger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const durationMs = Date.now() - startedAt;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs} ms)`);
  });

  next();
}

module.exports = logger;
