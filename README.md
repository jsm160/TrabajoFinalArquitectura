
# Proyecto Final - Arquitectura de Sistemas Software

Este proyecto implementa un sistema de comercio electrónico con arquitectura basada en microservicios REST y SOAP, una base de datos MongoDB Atlas y una interfaz de usuario desarrollada con Angular.

---

## Estructura del Proyecto

```
TRABAJOFINALARQUITECTURA/
│
├── BBDD_mongo_config/           # Configuración y script de inserción de datos
│   ├── config.js
│   └── insertData.js
│
├── Postman/                     # Colecciones Postman para pruebas REST
│   ├── ServicioAuth_Postman_Collection.json
│   ├── ServicioBanco_Postman_Collection.json
│   ├── ServicioCatalogo_Postman_Collection.json
│   └── ServicioPedido_Postman_Collection.json
│
├── ServiciosREST/              # Microservicios REST
│   ├── ServicioAuth/
│   ├── ServicioBanco/
│   ├── ServicioCatalogo/
│   └── ServicioPedido/
│
├── ServiciosSOAP/              # Servicios SOAP (en desarrollo)
│   ├── ServicioBPEL/
│   ├── ServicioProovedor/
│   └── ServicioStock/
│
├── View/                       # Aplicación Angular (interfaz de usuario)
│   └── proyecto-tienda-app/
│       ├── src/
│       ├── angular.json
│       └── package.json
```

---

## Requisitos

- Node.js (versión 18+)
- MongoDB Atlas (conexión remota)
- Angular CLI (`npm install -g @angular/cli`)
- Postman para pruebas de API
- MongoDB Compass (opcional, para ver los datos)

---

## Instrucciones de ejecución

### 1. Instalar dependencias de cada servicio

```bash
cd ServiciosREST/ServicioAuth && npm install
cd ../ServicioBanco && npm install
cd ../ServicioCatalogo && npm install
cd ../ServicioPedido && npm install
```

### 2. Insertar datos en MongoDB Atlas

```bash
cd ../../BBDD_mongo_config
node insertData.js
```

### 3. Ejecutar los microservicios REST

En 4 terminales separados:

```bash
cd ServiciosREST/ServicioAuth && node index.js
cd ../ServicioBanco && node index.js
cd ../ServicioCatalogo && node index.js
cd ../ServicioPedido && node index.js
```

### 4. Ejecutar la interfaz Angular

```bash
cd View/proyecto-tienda-app
npm install
ng serve
```

La aplicación se abrirá en: `http://localhost:4200`

---

## Endpoints REST principales

| Servicio         | Endpoint                        | Descripción                       |
|------------------|----------------------------------|-----------------------------------|
| Auth             | `POST /api/auth/login`          | Iniciar sesión                    |
| Auth             | `POST /api/auth/register`       | Registro de usuario               |
| Banco            | `POST /api/banco/pago`          | Validar pago                      |
| Catálogo         | `GET /api/products`             | Ver productos                     |
| Catálogo         | `POST /api/products`            | Añadir nuevo producto             |
| Pedido           | `POST /api/pedidos`             | Crear nuevo pedido                |
| Pedido           | `GET /api/pedidos`              | Listar pedidos                    |

---

## Pruebas con Postman

Las colecciones se encuentran en la carpeta `/Postman`. Puedes importarlas directamente en Postman para realizar pruebas con los endpoints de cada microservicio.

---



## Autoría

- Trabajo realizado como proyecto final para la asignatura **Arquitectura de Sistemas Software** - Máster en Ingeniería Web - Universidad de Alicante.
- Realizado por: **Mónica Garrigós Sánchez**.
- Realizado por: **Javier Sirvent Mancheño**.
- Realizado por: **Laura Ximena Martínez Monrroy**.

