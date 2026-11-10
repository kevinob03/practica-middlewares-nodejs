const users = [
  { token: 'abc123', nombre: 'Ana', rol: 'admin' },
  { token: 'xyz789', nombre: 'Luis', rol: 'user' },
];

function auth(req, res, next) {
  const authorization = req.get('Authorization');
  if (!authorization || !authorization.trim()) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: 'Formato de autorización inválido. Usa Bearer <token>' });
  }

  const user = users.find((candidate) => candidate.token === match[1].trim());
  if (!user) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  req.user = { nombre: user.nombre, rol: user.rol };
  return next();
}

function authorize(rol) {
  return function authorizeRole(req, res, next) {
    if (!req.user || req.user.rol !== rol) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    return next();
  };
}

module.exports = { auth, authorize };
