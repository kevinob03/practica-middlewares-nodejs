const allowedPriorities = ['baja', 'media', 'alta'];

function validateTask(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const errors = [];

  if (!Object.prototype.hasOwnProperty.call(body, 'titulo') || body.titulo === undefined || body.titulo === null || body.titulo === '') {
    errors.push('El titulo es obligatorio');
  } else if (typeof body.titulo !== 'string') {
    errors.push('El titulo debe ser texto');
  } else if (body.titulo.trim().length < 3 || body.titulo.trim().length > 100) {
    errors.push('El titulo debe tener entre 3 y 100 caracteres');
  }

  if (body.prioridad !== undefined && !allowedPriorities.includes(body.prioridad)) {
    errors.push('La prioridad debe ser baja, media o alta');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errores: errors });
  }
  return next();
}

module.exports = validateTask;
