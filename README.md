# Práctica: Middlewares en Node.js con Express

API REST de tareas en memoria. Incluye logger, autenticación por token, autorización por rol, validación, manejo centralizado de errores y un límite de 10 peticiones por minuto por IP.

## Requisitos e instalación

- Node.js 18 o posterior
- npm

Desde la carpeta del proyecto:

```bash
npm install
npm start
```

El servidor escucha en `http://localhost:3000`. Para elegir otro puerto, define `PORT` antes de ejecutar `npm start`.

## Tokens de prueba

| Token | Usuario | Rol |
| --- | --- | --- |
| `abc123` | Ana | `admin` |
| `xyz789` | Luis | `user` |

Envía el token como `Authorization: Bearer <token>`.

## Rutas

| Método | Ruta | Acceso | Resultado |
| --- | --- | --- | --- |
| GET | `/api/tasks` | Público | Lista las tareas |
| GET | `/api/tasks/:id` | Público | Devuelve una tarea; 404 si no existe |
| POST | `/api/tasks` | Token válido | Crea una tarea (201) |
| DELETE | `/api/tasks/:id` | Token admin | Elimina una tarea (200); 404 si no existe |

La lista inicial contiene las tareas con id `1`, `2` y `3`. Para crear una tarea, `titulo` es obligatorio (texto de 3 a 100 caracteres); `prioridad` es opcional (`baja`, `media` o `alta`). Si se omite, se asigna `media`.

### Ejemplos

```bash
curl http://localhost:3000/api/tasks
curl http://localhost:3000/api/tasks/1
curl -X POST http://localhost:3000/api/tasks -H "Authorization: Bearer abc123" -H "Content-Type: application/json" -d '{"titulo":"Preparar entrega","prioridad":"alta"}'
curl -X DELETE http://localhost:3000/api/tasks/1 -H "Authorization: Bearer abc123"
```

## Verificación de los ocho casos

Inicia el servidor y ejecuta los comandos en otra terminal. Los ejemplos con `curl` están escritos para Bash; en Windows PowerShell puedes usar `curl.exe` para evitar el alias de `curl`, o `Invoke-RestMethod` para enviar JSON (por ejemplo: `Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -Headers @{Authorization='Bearer abc123'} -ContentType 'application/json' -Body (@{titulo='Preparar entrega'; prioridad='alta'} | ConvertTo-Json)`). Las respuestas de POST y DELETE cambian el estado en memoria; para repetir la secuencia desde el estado inicial, reinicia el servidor.

1. **Listar tareas (200):** `curl.exe -i http://localhost:3000/api/tasks`
2. **Tarea inexistente (404 centralizado):** `curl.exe -i http://localhost:3000/api/tasks/999` → `{"error":"Tarea no encontrada","status":404}`
3. **POST sin token (401):** `curl.exe -i -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d "{}"` → `{"error":"Token no proporcionado"}`
4. **POST válido sin título (400):** `curl.exe -i -X POST http://localhost:3000/api/tasks -H "Authorization: Bearer abc123" -H "Content-Type: application/json" -d "{}"` → `{"errores":["El titulo es obligatorio"]}`
5. **POST válido con datos (201):** `curl.exe -i -X POST http://localhost:3000/api/tasks -H "Authorization: Bearer abc123" -H "Content-Type: application/json" -d "{\"titulo\":\"Preparar entrega\",\"prioridad\":\"alta\"}"`
6. **DELETE con rol user (403):** `curl.exe -i -X DELETE http://localhost:3000/api/tasks/1 -H "Authorization: Bearer xyz789"` → `{"error":"No tienes permisos para esta acción"}`
7. **DELETE con rol admin (200):** `curl.exe -i -X DELETE http://localhost:3000/api/tasks/1 -H "Authorization: Bearer abc123"`
8. **Ruta inexistente (404):** `curl.exe -i http://localhost:3000/api/ruta-que-no-existe` → `{"error":"Ruta no encontrada"}`

La transcripción de las ocho respuestas HTTP capturadas al ejecutar la API está en [evidence/evidencia-casos.md](evidence/evidencia-casos.md). También puedes repetir las solicitudes en Postman o Thunder Client y adjuntar capturas de pantalla al entregar la práctica.

## Orden de ejecución y explicación

`app.js` registra primero `logger`, luego `express.json()`, después el rate limiter y las rutas, seguido de `notFound` y `errorHandler`. Las rutas protegidas encadenan `auth` antes de la validación o autorización.

Si `errorHandler` se registra antes de las rutas, Express ya habrá pasado ese punto de la cadena cuando una ruta posterior llame a `next(error)`, por lo que ese manejador no capturará el error; podría terminar en el manejador predeterminado de Express. Si un middleware no responde ni llama a `next()` o `next(error)`, la petición queda abierta y el cliente espera hasta agotar el tiempo de espera.

## Rate limiting opcional

El middleware propio permite hasta 10 solicitudes en una ventana de 60 segundos por `req.ip`; la siguiente recibe 429. El contador vive en memoria y se reinicia al reiniciar el servidor.
