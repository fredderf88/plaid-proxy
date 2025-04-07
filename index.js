const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/plaid", async (req, res) => {
  const { path, payload } = req.body;

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
    res.status(500).json({ error: error.message, detail: error.response?.data });
  }
});

app.listen(port, () => {
  console.log(`Proxy Plaid en écoute sur le port ${port}`);
});
