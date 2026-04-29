const router = require('express').Router();
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are the ResiPilot AI Assistant — an expert in foster care management, child welfare, and social work. You help case workers with:
- Case management guidance and best practices
- Risk assessment analysis and recommendations
- Foster family matching insights
- Child welfare regulations and compliance
- Report writing and documentation tips
- Wellbeing monitoring interpretation

Be compassionate, professional, and actionable. Always prioritize child safety and wellbeing.`;


router.get('/test', (req, res) => {
  res.send("AI ROUTE WORKING");
});

router.post('/chat', auth, async (req, res) => {
  try {
    const { messages, caseData } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${SYSTEM_PROMPT}

Case Context:
${JSON.stringify(caseData || {})}
`
        },
        ...messages
      ],
      stream: true,
      max_tokens: 300,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    console.error('AI chat error:', err);

    if (!res.headersSent) {
      res.write(`data: ${JSON.stringify({
        choices: [{ delta: { content: "⚠️ AI is temporarily unavailable. Please try again." } }]
      })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

router.post('/match', auth, async (req, res) => {
  try {
    const { children, families } = req.body;

    if (!children || !families) {
      return res.status(400).json({ error: "Children and families required" });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
You are an expert foster care placement AI.

IMPORTANT RULES:
- ONLY return valid JSON
- NO text outside JSON
- NO explanations outside JSON
- DO NOT truncate response

Format EXACTLY:

{
  "results": [
    {
      "child": "Child Name",
      "matches": [
        {
          "family": "Family Name",
          "score": 85,
          "factors": ["reason1", "reason2"],
          "explanation": "text",
          "confidence": 90
        }
      ]
    }
  ]
}
`
        },
        {
          role: 'user',
          content: `
Children:
${JSON.stringify(children)}

Families:
${JSON.stringify(families)}
`
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 800,
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content);
    res.json(result);

  } catch (err) {
    console.error("MATCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/risk-assessment', auth, async (req, res) => {
    console.log("🔥 RISK API HIT"); // 👈 ADD THIS
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', 
content: `
You are an AI risk assessment system for child welfare.

STRICT RULES:
- ONLY return valid JSON
- NO extra text
- NO explanation outside JSON

Format EXACTLY:

{
  "riskLevel": "low | medium | high | critical",
  "factors": ["factor1", "factor2"],
  "recommendations": ["action1", "action2"]
}
`
        },
        { role: 'user', content: `Assess risk for: ${JSON.stringify(req.body)}` }
      ],
      response_format: { type: 'json_object' },
    });
    const raw = response.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({
        error: "Invalid JSON from AI",
        raw
      });
    }

    res.json(parsed);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
