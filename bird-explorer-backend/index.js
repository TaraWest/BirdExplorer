import express from "express";
import dotenv from "dotenv";
import router from "./router/birdRouter.js";
import { fetchAndStoreBirdData } from "./services/birdService.js";
import sequelize from "./database/client.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.static(".env"));
app.use(router);
// Synchronisation des modèles avec la base de données et initialisation des données
sequelize
  .sync({ alter: true }) // { force: true } pour recréer les tables, { alter: true } pour les mettre à jour sans perte de données
  .then(() => {
    console.log("Database & tables created!");
    return fetchAndStoreBirdData(); // Récupération et stockage des données
  })
  .then(() => {
    console.log("Bird data fetched and stored successfully");
  })
  .catch((err) => {
    console.error("Failed to setup database or fetch bird data", err);
  });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
