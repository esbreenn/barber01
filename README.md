# Barber Turnos

## Descripción del proyecto
Barber Turnos es una aplicación web pensada para facilitar la gestión diaria de una barbería.
Su objetivo principal es organizar los turnos de los clientes y concentrar en un solo lugar
las tareas administrativas más frecuentes.

**Principales funcionalidades:**

- Agenda de turnos con vista de calendario y notificaciones de recordatorio.
- Registro de clientes y de los servicios que se ofrecen.
- Control de ventas de productos y resumen de finanzas diarias.
- Autenticación de usuarios mediante Firebase.

## Instalación
1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd barber01
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```

## Ejecución en desarrollo
1. Configura las variables de entorno como se indica en la sección siguiente.
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

## Variables de entorno
Este proyecto utiliza Firebase. Crea un archivo `.env` en la raíz del proyecto a partir de `.env.example` y define las siguientes variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Estos valores configuran el SDK de Firebase para la autenticación y el acceso a Firestore.

## Despliegue
1. Construye la aplicación de producción:
   ```bash
   npm run build
   ```
2. Para publicar en GitHub Pages utiliza:
   ```bash
   npm run deploy
   ```
   También puedes desplegar en Vercel configurando las variables de entorno y utilizando el archivo `vercel.json` incluido.

## Ejemplo de flujo de uso
1. El usuario inicia sesión con sus credenciales.
2. Desde la agenda agrega, edita o elimina turnos para sus clientes.
3. Al completar un corte puede registrar la venta y ver la ganancia diaria acumulada.
4. Los paneles de servicios, clientes y ventas de productos permiten administrar el resto de la barbería.

## Estructura de la base de datos y reglas de seguridad
La base de datos de Firestore se estructura en torno a una colección de usuarios:

```
users/{userId}
  turnos/{turnoId}
  ventasProductos/{ventaId}
```

Cada documento y subcolección solo puede ser leído o escrito por el usuario autenticado cuyo ID coincide con `userId`. Se eliminaron las colecciones globales de `turnos` y `productSales` para evitar que un usuario autenticado acceda o modifique datos de otros. De esta manera se protege la privacidad de la información y se reducen riesgos de manipulación no autorizada.

## Ejecutar tests
Instala las dependencias y luego ejecuta:

```bash
npm test
```

Esto ejecutará la suite de pruebas con Vitest.

## License
This project is licensed under the [MIT License](LICENSE).

