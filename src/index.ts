import express from "express";

const app = express();
const PORT = 8080;

// Middleware para json
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
  res.send("API com TS");
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});
