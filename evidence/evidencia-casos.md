# Evidencia de ejecuci?n de los ocho casos

Ejecutado contra el servidor local el 2026-11-10 14:01:48 -0600. Respuestas HTTP reales (estado, encabezados y cuerpo).

## 1. GET /api/tasks (lista, 200)

```http
HTTP 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 209
ETag: W/"d1-eE7vMApxGvwnXNu7SvrgYZa7PHU"
Date: Tue, 10 Nov 2026 20:01:48 GMT
Connection: close

[{"id":1,"titulo":"Leer documentación de Express","prioridad":"media"},{"id":2,"titulo":"Crear middleware de autenticación","prioridad":"alta"},{"id":3,"titulo":"Probar la API de tareas","prioridad":"baja"}]
```

## 2. GET /api/tasks/999 (tarea inexistente, 404)

```http
HTTP 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 44
ETag: W/"2c-q1eAue3WWUyR/6xpKCQEHp168qY"
Date: Tue, 10 Nov 2026 20:01:48 GMT
Connection: close

{"error":"Tarea no encontrada","status":404}
```

## 3. POST /api/tasks sin token (401)

```http
HTTP 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 34
ETag: W/"22-a5AGBJ3wo9XYPif6SAp92FOHtH4"
Date: Tue, 10 Nov 2026 20:01:48 GMT
Connection: close

{"error":"Token no proporcionado"}
```

## 4. POST /api/tasks sin titulo (400)

```http
HTTP 400 Bad Request
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 40
ETag: W/"28-K0/TcaS6cy+PVHiUBeBvobrBfb8"
Date: Tue, 10 Nov 2026 20:01:48 GMT
Connection: close

{"errores":["El titulo es obligatorio"]}
```

## 5. POST /api/tasks valido (201)

```http
HTTP 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 55
ETag: W/"37-Ivl1jOIjSbownywJH5wb7fuNtsQ"
Date: Tue, 10 Nov 2026 20:01:48 GMT
Connection: close

{"id":4,"titulo":"Preparar entrega","prioridad":"alta"}
```

## 6. DELETE /api/tasks/1 con rol user (403)

```http
HTTP 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 48
ETag: W/"30-TS4F/XaaWiB63Wsfq8g0UWhNQV4"
Date: Tue, 10 Nov 2026 20:01:48 GMT
Connection: close

{"error":"No tienes permisos para esta acción"}
```

## 7. DELETE /api/tasks/1 con rol admin (200)

```http
HTTP 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-qL2Fn+fWjwuWCWU3jAlKBQw7XnI"
Date: Tue, 10 Nov 2026 20:01:48 GMT
Connection: close

{"mensaje":"Tarea eliminada","tarea":{"id":1,"titulo":"Leer documentación de Express","prioridad":"media"}}
```

## 8. GET ruta inexistente (404)

```http
HTTP 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 30
ETag: W/"1e-vhoou9sM6XmJtOZWC9/edTTWHh8"
Date: Tue, 10 Nov 2026 20:01:48 GMT
Connection: close

{"error":"Ruta no encontrada"}
```
