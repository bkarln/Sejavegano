const fileInput = document.getElementById('file-upload');
const imagePreview = document.getElementById('image-preview');
const loadingIndicator = document.getElementById('loading');
const resultsContainer = document.getElementById('results');
const resultText = document.getElementById('result-text');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.classList.remove('hidden');
      resultsContainer.classList.add('hidden');
      loadingIndicator.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }
});

const apiKey = 'SUA_API_KEY_AQUI';
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

imagePreview.addEventListener('click', () => {
  if (imagePreview.src && !loadingIndicator.classList.contains('hidden')) return;

  const file = fileInput.files[0];
  if (!file) {
    console.error("Por favor, selecione uma imagem do rótulo primeiro.");
    return;
  }

  loadingIndicator.classList.remove('hidden');
  resultsContainer.classList.add('hidden');

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64Image = e.target.result.split(',')[1];
    const mimeType = file.type;

    const systemPrompt = "Você é um especialista em análise de rótulos de alimentos e dietas vegetarianas...";
    const userPrompt = "Analise o rótulo de alimentos nesta imagem para determinar se o produto é vegetariano...";

    const payload = {
      contents: [{
        parts: [
          { text: userPrompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          }
        ]
      }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível analisar o rótulo.';
      resultText.innerText = text;
    } catch (error) {
      console.error("Erro ao chamar a API:", error);
      resultText.innerText = "Desculpe, ocorreu um erro ao analisar o rótulo.";
    } finally {
      loadingIndicator.classList.add('hidden');
      resultsContainer.classList.remove('hidden');
    }
  };

  reader.readAsDataURL(file);
});
