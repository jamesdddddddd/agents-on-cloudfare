// index.js

export default {
  async fetch(request, env, ctx) {
    // 1. Define the AI Model (Sentiment Classification)
    // This model is fine-tuned to classify text as POSITIVE or NEGATIVE
    const model = '@cf/distilbert-base-uncased-finetuned-sst-2-english';

    // 2. Define the Text to Analyze
    // This is the input that simulates a user comment or message.
    const input_text = "I love how fast this Cloudflare Worker is!";

    // Define the inputs object for the model
    const inputs = {
      text: input_text
    };

    try {
      // 3. Call the Workers AI service (bound as 'AI' in wrangler.toml)
      // The model returns an array of classification results.
      const response = await env.AI.run(model, inputs);

      // The output is an array. We access the first and most confident result.
      const result = response[0];
      const sentiment = result.label; // e.g., "POSITIVE"
      const confidence = (result.score * 100).toFixed(2); // e.g., 99.85

      // 4. Return the classification result as a JSON response
      return new Response(JSON.stringify({
        input: input_text,
        sentiment: sentiment,
        confidence: `${confidence}%`
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
      
    } catch (e) {
      console.error(e);
      return new Response(`AI Inference Error: ${e.message}`, { status: 500 });
    }
  },
};

