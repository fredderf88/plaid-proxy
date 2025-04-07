import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// Test de vie : https://ton-proxy.onrender.com/status
app.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

// Tunnel vers Plaid : toutes les requêtes passent ici
app.post("/plaid", async (req, res) => {
  const { path, payload } = req.body;

  if (!path || !payload) {
    return res.status(400).json({ error: "Requête invalide : path ou payload manquant." });
  }

  try {
    const response = await axios.post(
      `https://${process.env.PLAID_ENV}.plaid.com${path}`,
      {
        ...payload,
        client_id: process.env.PLAID_CLIENT_ID,
        secret: process.env.PLAID_SECRET,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erreur Plaid :", error.response?.data || error.message);
    res.status(500).json({
      error: error.message,
      detail: error.response?.data || "Erreur inconnue",
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Proxy Plaid démarré sur le port ${port}`);
});

