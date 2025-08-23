# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Variables de entorno

Este proyecto utiliza Firebase. Crea un archivo `.env` en la raíz del proyecto a partir de `.env.example` y define las siguientes variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Estos valores configuran el SDK de Firebase para la autenticación y el acceso a Firestore.

## Estructura de la base de datos y reglas de seguridad

La base de datos de Firestore se estructura en torno a una colección de usuarios:

```
users/{userId}
  turnos/{turnoId}
  ventasProductos/{ventaId}
```

Cada documento y subcolección solo puede ser leído o escrito por el usuario autenticado cuyo ID coincide con `userId`. Se eliminaron las colecciones globales de `turnos` y `productSales` para evitar que un usuario autenticado acceda o modifique datos de otros. De esta manera se protege la privacidad de la información y se reducen riesgos de manipulación no autorizada.
