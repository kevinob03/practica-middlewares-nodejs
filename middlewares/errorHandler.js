function notFound(req, res, next) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = Number.isInteger(err.status) && err.status >= 400 && err.status <= 599
    ? err.status
    : 500;
  const message = typeof err.message === 'string' && err.message.trim()
    ? err.message
    : 'Error interno del servidor';

  return res.status(status).json({ error: message, status });
}

module.exports = { notFound, errorHandler };
