import alfredPersona from '../personas/alfred.json';

type RedPillResponse = {
  choices: {
    message: {
      content: string
    }
  }[]
}

export class RedPillAI {
  async chat({ message, model, apiKey }: {
    message: string
    model: string
    apiKey: string
  }) {
    try {
      const systemPrompt = alfredPersona.context_injection.prefix;
      
      const response = await fetch('https://api.red-pill.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ]
        })
      });

      const data: any = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('RedPill API error:', error);
      throw new Error('Failed to get AI response');
    }
  }
} 