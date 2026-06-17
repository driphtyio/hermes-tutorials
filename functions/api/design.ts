// Design Generator API — calls OpenRouter to generate HTML/CSS from a prompt
interface Env {
	OPENROUTER_API_KEY: string;
}

interface DesignRequest {
	prompt: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	const { request, env } = context;

	if (request.method !== 'POST') {
		return new Response(JSON.stringify({ error: 'Send a POST request with { prompt }' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let body: DesignRequest;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const { prompt } = body;
	if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
		return new Response(JSON.stringify({ error: 'Prompt is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const systemPrompt = `You are a UI/UX design generator. Generate a complete, self-contained UI component based on the user's description.

OUTPUT FORMAT — Return ONLY valid JSON with this exact structure, no markdown:
{"html": "<!-- HTML content -->", "css": "/* CSS stylesheet */"}

DESIGN SYSTEM (use these unless the prompt specifies otherwise):
- Dark theme: background #0a0a0b, cards #121214, borders #1e1e22
- Text: primary #e8e8ed, secondary #a1a1aa, muted #6b6b76
- Accent: #6c5ce7 (purple), hover #a29bfe
- Font: system sans-serif (Inter, -apple-system)
- Border radius: 8px default, 12px for cards
- Transitions: 0.15s ease

RULES:
- HTML: clean, semantic elements only (no <html>/<head>/<body> tags)
- CSS: complete stylesheet with all needed styles, use modern CSS (flexbox/grid/clamp/custom properties)
- Dark theme by default unless prompt asks for light
- Responsive — add a @media (max-width: 640px) breakpoint
- ~80-150 lines combined
- Include hover and focus states
- Use em/rem units, no px for sizing/spacing`;

	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': 'https://hermes-tutorials.dev',
			'X-Title': 'Hermes Design Generator',
		},
		body: JSON.stringify({
			model: 'deepseek/deepseek-chat',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: prompt },
			],
			temperature: 0.6,
			max_tokens: 2500,
		}),
	});

	const data = await response.json<any>();
	const content = data.choices?.[0]?.message?.content;

	if (!content) {
		return new Response(JSON.stringify({
			error: 'LLM returned no content',
			details: data.error || 'unknown',
		}), { status: 502, headers: { 'Content-Type': 'application/json' } });
	}

	// Parse JSON from response — may be wrapped in ```json ... ``` or plain
	let result: { html?: string; css?: string };
	try {
		const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
		const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
		// Find first { and last }
		const start = jsonStr.indexOf('{');
		const end = jsonStr.lastIndexOf('}');
		if (start === -1 || end === -1) throw new Error('No JSON object found');
		result = JSON.parse(jsonStr.slice(start, end + 1));
	} catch {
		// Fallback: return raw content as HTML
		return new Response(JSON.stringify({ html: content, css: '' }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify({
		html: result.html || '',
		css: result.css || '',
	}), { headers: { 'Content-Type': 'application/json' } });
};
