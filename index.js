// index.js

export default {
  async fetch(request, env, ctx) {
    // 1. Define the AI Model (Using your last known working identifier)
    const model = '@cf/huggingface/distilbert-sst-2-int8'; 

    const url = new URL(request.url);
    const input_text = url.searchParams.get('text');

    // Handle missing input (Needed for front-end structure)
    if (!input_text) {
      return new Response(JSON.stringify({
        error: "Missing 'text' parameter in the URL. Usage: /?text=I am happy to be here!"
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // CORS for front-end access
        },
      });
    }

    const inputs = {
      text: input_text
    };

    try {
      // 3. Call the Workers AI service
      const response = await env.AI.run(model, inputs);

      const result = response[0];
      let sentiment = result.label;
      
      // *** FIX 1: Define raw_score and confidence correctly ***
      const raw_score = result.score;
      let confidence = (raw_score * 100).toFixed(2); 

      // 4. *** FIX 2: Correct Label Swapping Logic ***
      // This corrects the issue of the model returning the wrong label name (e.g., NEGATIVE for high confidence POSITIVE)
      if (raw_score < 0.5) {
          // If raw score is low, invert both label and confidence value
          confidence = ((1 - raw_score) * 100).toFixed(2);
          
          if (sentiment === 'POSITIVE') {
              sentiment = 'NEGATIVE';
          } else {
              sentiment = 'POSITIVE';
          }
      }

      // 5. Final Return: Includes the processed result and the necessary CORS headers
      return new Response(JSON.stringify({
        input: input_text,
        sentiment: sentiment,
        confidence: `${confidence}%`
      }), {
        // *** CRITICAL FIX: CORS HEADERS ARE REACHABLE HERE ***
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',  // Allows access from Pages site
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
      
    } catch (e) {
      console.error(e);
      // Ensure the error response also includes CORS headers
      return new Response(JSON.stringify({
          error: "AI Inference Failed",
          detail: e.message
      }), { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
      });
    }
  },
};