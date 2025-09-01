import express from "express";
import cors from "cors";
import { HfInference } from "@huggingface/inference";

const app = express();
app.use(cors());
app.use(express.json());

// Initialiser Hugging Face avec le token depuis Render
const hf = new HfInference(process.env.HF_TOKEN);

// Route pour interroger le modèle
app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt requis" });

    const response = await hf.textGeneration({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7
      }
    });

    res.json({ reply: response.generated_text });
  } catch (error) {
    console.error("❌ Erreur Hugging Face :", error);
    res.status(500).json({ error: "Erreur lors de la génération" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🤖 Serveur IA en marche sur le port ${PORT}`);
});
