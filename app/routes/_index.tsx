import { Prompt } from '@dexaai/dexter';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { zx } from 'zodix';
import { summarizeSearchResults } from '~/services/openai';
import { SearchResult, searchGoogle } from '~/services/serpapi';

export const meta: MetaFunction = () => {
  return [{ title: 'Dexa Coding Interview' }];
};

export async function loader(args: LoaderFunctionArgs) {
  const { q } = zx.parseQuery(args.request, {
    q: z.string().optional(),
  });

  const searchResults: SearchResult[] = q?.length ? await searchGoogle(q) : [];
  const summary: Prompt.Msg|null = q?.length ? await summarizeSearchResults(q, searchResults) : null;
  return json({ q, searchResults, summary });
}

function SearchResultComponent({title, link, snippet}: SearchResult) {
  return (
    <div>
      <h3>{title}</h3>
      <a href={link}>{link}</a>
      <p>{snippet}</p>
    </div>
  );
}

function generateResults(searchResults: SearchResult[]) {
  if (searchResults) {
    return searchResults.map((result, idx) => <SearchResultComponent {...result} key={idx} />);
  }
  return <p>No search results found.</p>;
}

export default function Index() {
  const { q, searchResults, summary } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Welcome to the Dexa coding interview!</h1>
      <p>See the readme for instructions.</p>
      <Form method="get">
        <label htmlFor="search">Search</label>
        <input
          type="search"
          name="q"
          id="search"
          defaultValue={q ?? ''}
          placeholder="Search the web"
        />
        <button type="submit">Search</button>
      </Form>
      {summary ? <p>{`Summary: ${summary?.content}`}</p> : null}
      {generateResults(searchResults)}
    </div>
  );
}
