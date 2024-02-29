import { BaseResponse, getJson } from 'serpapi';
import { EnvVars } from './env-vars';

/**
 * Use this to get the Google search results for a query.
 * Docs: https://github.com/serpapi/serpapi-javascript
 */

// @TODO: Add a type for the search result.
export type SearchResult = {
  title: string;
  link: string;
  snippet: string;
};

/** Search Google for the given query using the SerpApi service. */
export async function searchGoogle(q: string): Promise<SearchResult[]> {
  // @TODO: Use the SerpApi SDK to perform a Google search.
  const json = await getJson({ engine: "google", api_key: EnvVars.serpapi(), q });
  const searchResult = json['organic_results']?.map((res: BaseResponse) => {
    return {
      title: res.title || '' ,
      snippet: res.snippet || '',
      link: res.link || '',
    }
  });

  return searchResult;
}
