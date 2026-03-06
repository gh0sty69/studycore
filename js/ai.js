/* AI Module — Google Gemini Integration */
const AI = (() => {
    const GEMINI_MODEL = 'gemini-2.0-flash';
    const HARDCODED_KEY = 'AIzaSyAOv21_2QS92W33f_a3Eoo9QwOgP88Ktl0';

    function getApiKey() {
        return HARDCODED_KEY;
    }

    function isAvailable() { return true; }

    async function call(prompt) {
        const key = getApiKey();
        if (!key) throw new Error('No API key');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
            })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message || 'API request failed');
        }
        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // Generate quiz questions from notes
    async function generateQuiz(notes, lang) {
        const langName = lang === 'sv' ? 'Swedish' : 'English';
        const prompt = `You are a study assistant. Based on the following study notes, generate exactly 5 multiple-choice quiz questions. Each question must test understanding of the content, NOT just fill in a missing word.

IMPORTANT RULES:
- Questions should test COMPREHENSION, not just vocabulary
- Each question has exactly 4 options with 1 correct
- Respond ONLY with valid JSON, no markdown, no code blocks
- All text must be in ${langName}

Response format (strict JSON array):
[{"question":"What is...?","options":["A","B","C","D"],"correct":0}]

The "correct" field is the index (0-3) of the correct answer.

Study notes:
${notes.substring(0, 3000)}`;
        const response = await call(prompt);
        // Extract JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('Invalid response format');
        return JSON.parse(jsonMatch[0]);
    }

    // Summarize notes
    async function summarize(notes, lang) {
        const langName = lang === 'sv' ? 'Swedish' : 'English';
        const prompt = `You are a study assistant. Summarize the following study notes. Respond ONLY with valid JSON, no markdown, no code blocks. All text must be in ${langName}.

Response format (strict JSON):
{"summary":"A clear 2-3 sentence summary","keyPoints":["point 1","point 2","point 3","point 4","point 5"],"concepts":["concept1","concept2","concept3","concept4","concept5"]}

Study notes:
${notes.substring(0, 4000)}`;
        const response = await call(prompt);
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid response format');
        return JSON.parse(jsonMatch[0]);
    }

    return { isAvailable, generateQuiz, summarize, call, getApiKey };
})();
