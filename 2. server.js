import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/ocr", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada." });
  }

  try {
    const result = await Tesseract.recognize(req.file.buffer, "por", {
      logger: (info) => console.log(info),
    });

    res.json({ text: result.data.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao processar OCR." });
  }
});

app.get("/", (req, res) => {
  res.send("OCR API funcionando!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
