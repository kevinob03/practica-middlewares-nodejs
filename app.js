const express = require('express');
const logger = require('./middlewares/logger');
const { auth, authorize } = require('./middlewares/auth');
const validateTask = require('./middlewares/validateTask');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const rateLimit = require('./middlewares/rateLimit');

const app = express();

let tasks = [
  { id: 1, titulo: 'Leer documentación de Express', prioridad: 'media' },
  { id: 2, titulo: 'Crear middleware de autenticación', prioridad: 'alta' },
  { id: 3, titulo: 'Probar la API de tareas', prioridad: 'baja' },
];
let nextTaskId = 4;

// El logger debe ser el primero para medir y registrar todas las respuestas.
app.use(logger);
app.use(express.json());
app.use(rateLimit);

app.get('/api/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/api/tasks/:id', (req, res, next) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));
  if (!task) {
    const error = new Error('Tarea no encontrada');
    error.status = 404;
    return next(error);
  }
  return res.status(200).json(task);
});

app.post('/api/tasks', auth, validateTask, (req, res) => {
  const task = {
    id: nextTaskId++,
    titulo: req.body.titulo.trim(),
    prioridad: req.body.prioridad || 'media',
  };
  tasks.push(task);
  res.status(201).json(task);
});

app.delete('/api/tasks/:id', auth, authorize('admin'), (req, res, next) => {
  const taskIndex = tasks.findIndex((item) => item.id === Number(req.params.id));
  if (taskIndex === -1) {
    const error = new Error('Tarea no encontrada');
    error.status = 404;
    return next(error);
  }
  const [deletedTask] = tasks.splice(taskIndex, 1);
  return res.status(200).json({ mensaje: 'Tarea eliminada', tarea: deletedTask });
});

// Las rutas desconocidas van antes del manejador centralizado de errores.
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`API disponible en http://localhost:${port}`);
  });
}

module.exports = app;
