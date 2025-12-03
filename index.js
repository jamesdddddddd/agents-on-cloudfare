// index.js

export default {
  // The fetch function is the entry point for all incoming requests
  async fetch(request, env, ctx) {
    // 1. Define the AI Model and the prompt/message
    // We use a powerful but fast language model here
    const model = '@cf/meta/llama-2-7b-chat-int8';
    
    // The messages array holds the conversation history for the AI
    const messages = [
      { role: "system", content: "You are a witty, helpful AI assistant that is excited about Cloudflare Workers." },
      { role: "user", content: "Tell me a short, friendly message for a new user." }
    ];

    try {
      // 2. Execute the AI model using the binding named 'AI' (defined in wrangler.toml)
      const response = await env.AI.run(model, { messages });
      
      // 3. Extract the text response from the model's output
      const aiMessage = response.response;

      // 4. Return the AI's response to the user's browser
      return new Response(`AI says: ${aiMessage}`, {
        headers: { 'Content-Type': 'text/plain' },
      });
      
    } catch (e) {
      console.error(e);
      return new Response(`AI Inference Error: ${e.message}`, { status: 500 });
    }
  },
};
