const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CONNECTOR_TOKEN = process.env.CONNECTOR_TOKEN || "";

function getBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return "";
  return authHeader.slice("Bearer ".length);
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "ade-connector",
    message: "Server attivo",
    mode: "stub-no-demo"
  });
});

app.post("/health", (req, res) => {
  res.json({
    ok: true,
    service: "ade-connector",
    message: "Health check ok",
    mode: "stub-no-demo"
  });
});

app.post("/consultazione", (req, res) => {
  const token = getBearerToken(req);

  if (!CONNECTOR_TOKEN || token !== CONNECTOR_TOKEN) {
    return res.status(401).json({
      ok: false,
      message: "Token non valido"
    });
  }

  const { clienteId, tipoDocumento, dataDal, dataAl } = req.body || {};

  if (!clienteId || !tipoDocumento || !dataDal || !dataAl) {
    return res.status(400).json({
      ok: false,
      message: "Servono clienteId, tipoDocumento, dataDal, dataAl"
    });
  }

  return res.json({
    documents: [],
    meta: {
      clienteId,
      tipoDocumento,
      dataDal,
      dataAl,
      message: "Nessun documento trovato"
    }
  });
});

app.post("/download", (req, res) => {
  const token = getBearerToken(req);

  if (!CONNECTOR_TOKEN || token !== CONNECTOR_TOKEN) {
    return res.status(401).json({
      ok: false,
      message: "Token non valido"
    });
  }

  return res.status(501).json({
    ok: false,
    message: "Download non ancora implementato"
  });
});

app.listen(PORT, () => {
  console.log(`ade-connector in ascolto sulla porta ${PORT}`);
});
