import express from "express";
import cors from "cors";
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Initialisation Hugging Face
const hf = new HfInference(process.env.HF_TOKEN);

// Endpoint IA pour le prototype
app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ reply: "Aucune question reçue" });

  try {
    // Appel LLM3-8b
    const response = await hf.textGeneration({
      model: "meta-llama/Llama-3-8b",
      inputs: prompt,
      parameters: { max_new_tokens: 200 }
    });

    // Envoi de la réponse
    res.json({ reply: response.generated_text });
  } catch (err) {
    console.error("Erreur IA :", err);
    res.json({ reply: "Erreur serveur IA" });
  }
});

app.listen(PORT, () => console.log(`🤖 Serveur IA en marche sur le port ${PORT}`));
