// index.js

export default {
  async fetch(request, env, ctx) {
    // 1. Define the AI Model (Sentiment Classification)
    // This model is fine-tuned to classify text as POSITIVE or NEGATIVE
    const model = '@cf/huggingface/distilbert-sst-2-int8';

    //change the hard coded text into text the user can enter
    const url = new URL(request.url);
    const input_text = url.searchParams.get('text');

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

      //Below code will fix the problem that the worker would return "NEGATIVE" sentiment everytime
      //  By swapping the label and reversing the confidence number
      if (raw_score < 0.5) {
    // 1. Recalculate the confidence based on the correct (opposite) label
    confidence = ((1 - raw_score) * 100).toFixed(2);
    
    // 2. Invert the label name
    if (sentiment === 'POSITIVE') {
        sentiment = 'NEGATIVE';
    } else {
        sentiment = 'POSITIVE';
    }
}

// ... (everything before the final return statement) ...

      // 5. Return the dynamic classification result
      return new Response(JSON.stringify({
        input: input_text,
        sentiment: sentiment,
        confidence: `${confidence}%`
      }), {
        // *** ADD THESE CORS HEADERS ***
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',  // Allows access from ANY domain
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
      
    } catch (e) {
      console.error(e);
      return new Response(`AI Inference Error: ${e.message}`, { status: 500 });
    }
  },
};

