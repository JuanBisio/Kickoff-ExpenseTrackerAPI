# API (Node.js - TypeScript - MongoDB)

API para **registrar gastos**, consultarlos con filtros (fecha, pagado, texto) y llevar un **histórico de totales diarios** mediante un **cron job nocturno**.  

---

## Requisitos previos
- [Node.js](https://nodejs.org/) >= 18  
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)  
- [MongoDB](https://www.mongodb.com/) (local o en Docker)  
- [Postman](https://www.postman.com/) (para probar los endpoints)  
- (Opcional) [Docker](https://www.docker.com/) + Docker Compose

---

## Instalación
```bash
# 1. Clonar el repo
git clone https://github.com/JuanBisio/Kickoff-ExpenseTrackerAPI-.git
cd Kickoff-ExpenseTrackerAPI

# 2. Instalar dependencias
npm install

# 3. Copiar archivo de entorno
cp .env.example .env

# 4. Levantar DB
docker run -d --name mongo \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo:6

# 5. Ejecutar
# Desarrollo
npm run dev

# Cargar gastos a la DB
npm run seed

# Compilar a JS
npm run build
# Producción
npm start


