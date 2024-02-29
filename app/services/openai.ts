import { ChatModel, Msg, Prompt, createOpenAIClient } from '@dexaai/dexter';
import { EnvVars } from './env-vars';
import type { SearchResult } from './serpapi';

/**
 * Use this to make requests to the OpenAI API.
 * Docs: https://github.com/dexaai/dexter
 */

/** Client for making requests to the OpenAI API. */
const openaiClient = createOpenAIClient({ apiKey: EnvVars.openAI() });

const system = Msg.system(`
  You are a helpful and accurate explainer bot.
  Given search results, and query, you attempt to respond to the query using the search results to the best of your ability.
`);

function userMsg(query: string, chunks: unknown[]) {
  return Msg.user(`
    QUESTION: ${query}
    SEARCH RESULTS:
    \`\`\`json
    ${JSON.stringify(chunks, null, 2)}
    \`\`\`
  `);
}

/** Use ChatModel to make requests to the chat completion endpoint. */
const chatModel = new ChatModel({
  client: openaiClient,
  debug: true,
  params: {
    model: 'gpt-3.5-turbo-1106',
  },
});

/** Summarize Google search results using the OpenAI API. */
export async function summarizeSearchResults(
  query: string,
  searchResults: SearchResult[]
): Promise<Prompt.Msg> {
  const messages: Prompt.Msg[] = [system, userMsg(query, searchResults)];
  const { message } = await chatModel.run({
    messages,
  });
  return message;
}
