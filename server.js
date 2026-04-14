const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CONNECTOR_TOKEN = process.env.CONNECTOR_TOKEN || "";

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "ade-connector",
    message: "Server attivo",
  });
});

app.post("/health", (req, res) => {
  res.json({
    ok: true,
    service: "ade-connector",
    message: "Health check ok",
  });
});

app.post("/consultazione", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!CONNECTOR_TOKEN || token !== CONNECTOR_TOKEN) {
    return res.status(401).json({
      ok: false,
      message: "Token non valido",
    });
  }

  const { clienteId, tipoDocumento, dataDal, dataAl } = req.body;

  return res.json({
    documents: [
      {
        id: "ade-demo-001",
        data: dataAl || "2026-04-13",
        tipo: "TD01",
        numero: "DOC-REALE-TEST-001",
        fornitorePiva: "01234567890",
        statoAde: "Consegnata"
      }
    ],
    meta: {
      clienteId,
      tipoDocumento,
      dataDal,
      dataAl
    }
  });
});

app.listen(PORT, () => {
  console.log(`ade-connector in ascolto sulla porta ${PORT}`);
});
