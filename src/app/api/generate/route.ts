import { NextResponse } from "next/server";
import axios from "axios";
import { GenerateBlogRequest } from "@/types/blog";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const body: GenerateBlogRequest = await request.json();
    const { title, keywords } = body;

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "Deepseek API key is not configured" },
        { status: 500 }
      );
    }

    let prompt = "Write a detailed blog post in approximately 500 words";
    if (title) {
      prompt += ` about ${title}`;
    }
    if (keywords && keywords.length > 0) {
      prompt += ` covering the following topics: ${keywords.join(", ")}`;
    }

    type Perspective = 'software-engineer' | 'student' | 'teacher' | 'business-professional' | 'casual-blogger';
    
    const perspectiveInstructions: Record<Perspective, string> = {
      'software-engineer': 'Write from the perspective of an experienced software engineer, using technical terminology and practical development insights.',
      'student': 'Write from a student\'s perspective, focusing on learning experiences and relatable explanations.',
      'teacher': 'Write as an educator, emphasizing clear explanations and educational value.',
      'business-professional': 'Write from a business professional\'s viewpoint, focusing on practical applications and business value.',
      'casual-blogger': 'Write in a casual, conversational tone, making the content accessible to a general audience.',
    };

    const perspective = (body.perspective as Perspective) || 'casual-blogger';
    prompt += `. ${perspectiveInstructions[perspective]}`;
    prompt += " Keep the content concise and focused within the 500-word limit.";

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.statusText}`);
    }

    // Create a new readable stream that will process the response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (!data || data === '[DONE]') continue;

                try {
                  // Ensure the data is valid JSON before parsing
                  if (!/^[\[{].*[\]}]$/.test(data)) {
                    console.warn('Invalid JSON data received:', data);
                    continue;
                  }

                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch (e) {
                  console.error('Error parsing JSON:', e, 'Data:', data);
                  // Don't throw, just continue with the next chunk
                  continue;
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error("Error generating blog post:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
} 