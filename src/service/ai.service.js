// OLD CODE (commented out for reference):
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// async function generateCaption(imageBase64) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//   const prompt = "Generate a caption for this image";
//   const result = await model.generateContent([prompt, { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }]);
//   return result.response.text();
// }
// module.exports = { generateCaption };

// NEW CODE (updated to new Google GenAI SDK):
const { GoogleGenAI } = require("@google/genai");

async function generateCaption(imageBase64) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    console.log('✓ Initializing Google GenAI...');
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `Generate exactly 3 creative and engaging captions for this image.

Rules for every caption, no exceptions:
- Length: 1-2 short lines (about 6-12 words)
- Include exactly 1-2 emojis placed naturally within the sentence (never omit)
- End with 3-5 relevant, trending hashtags starting with # (never omit)
- Avoid generic phrases like "beautiful day" or "living my best life"
- Each caption should have a distinct tone: one witty, one aesthetic, one bold/confident

Output rules:
- Do not number or label the captions
- Separate each caption with a blank line
- Output only the 3 captions, nothing else — no intro, no explanation

A caption missing an emoji or missing hashtags is invalid and must be corrected before output.`;


    console.log('⏳ Sending image to Gemini AI...');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ],
      config: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 300
      }
    });

    const caption = response.text;

    console.log('✓ Caption generated successfully');
    console.log('  Preview:', caption.substring(0, 100) + '...');
    
    return caption;

  } catch (error) {
    console.error('✗ AI Service Error:', error.message);
    console.error('Full error:', error);
    
    // Provide more specific error messages
    if (error.message.includes('API key') || error.message.includes('401')) {
      throw new Error('Invalid or missing Gemini API key');
    } else if (error.message.includes('quota') || error.message.includes('429')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    } else if (error.message.includes('rate limit')) {
      throw new Error('Too many requests. Please try again in a few seconds.');
    } else if (error.message.includes('not found') || error.message.includes('404')) {
      throw new Error('Model not available. Please check your API configuration.');
    } else {
      throw new Error(`AI service error: ${error.message}`);
    }
  }
}

module.exports = {
  generateCaption
};