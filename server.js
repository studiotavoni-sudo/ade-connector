const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CONNECTOR_TOKEN = process.env.CONNECTOR_TOKEN || "";

function getBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "ade-connector",
    message: "Server attivo",
    mode: "stub-no-demo",
  });
});

app.post("/health", (req, res) => {
  res.json({
    ok: true,
    service: "ade-connector",
    message: "Health check ok",
    mode: "stub-no-demo",
  });
});

app.post("/consultazione", async (req, res) => {
  try {
    const token = getBearerToken(req);

    if (!CONNECTOR_TOKEN || token !== CONNECTOR_TOKEN) {
      return res.status(401).json({
        ok: false,
        code: "TOKEN_NON_VALIDO",
        message: "Token non valido",
      });
    }

    const { clienteId, tipoDocumento, dataDal, dataAl } = req.body || {};

    if (!clienteId || !tipoDocumento || !dataDal || !dataAl) {
      return res.status(400).json({
        ok: false,
        code: "PARAMETRI_MANCANTI",
        message: "Servono clienteId, tipoDocumento, dataDal, dataAl",
      });
    }

    // QUI andrà la logica reale AdE.
    // Per ora NON restituiamo più documenti fake.
    return res.status(501).json({
      ok: false,
      code: "ADE_NON_IMPLEMENTATO",
      message:
        "Il connettore è online, ma la consultazione reale AdE non è ancora implementata in questo backend.",
      details: {
        clienteId,
        tipoDocumento,
        dataDal,
        dataAl,
      },
    });
  } catch (error) {
    console.error("Errore /consultazione:", error);

    return res.status(500).json({
      ok: false,
      code: "ERRORE_INTERNO",
      message: error instanceof Error ? error.message : "Errore interno",
    });
  }
});

app.post("/download", async (req, res) => {
  try {
    const token = getBearerToken(req);

    if (!CONNECTOR_TOKEN || token !== CONNECTOR_TOKEN) {
      return res.status(401).json({
        ok: false,
        code: "TOKEN_NON_VALIDO",
        message: "Token non valido",
      });
    }

    const { clienteId, documentId, tipoDocumento } = req.body || {};

    if (!clienteId || !documentId || !tipoDocumento) {
      return res.status(400).json({
        ok: false,
        code: "PARAMETRI_MANCANTI",
        message: "Servono clienteId, documentId, tipoDocumento",
      });
    }

    // QUI andrà il download reale XML / documento AdE.
    return res.status(501).json({
      ok: false,
      code: "DOWNLOAD_NON_IMPLEMENTATO",
      message:
        "Il download reale del documento non è ancora implementato in questo backend.",
      details: {
        clienteId,
        documentId,
        tipoDocumento,
      },
    });
  } catch (error) {
    console.error("Errore /download:", error);

    return res.status(500).json({
      ok: false,
      code: "ERRORE_INTERNO",
      message: error instanceof Error ? error.message : "Errore interno",
    });
  }
});

app.listen(PORT, () => {
  console.log(`ade-connector in ascolto sulla porta ${PORT}`);
});
