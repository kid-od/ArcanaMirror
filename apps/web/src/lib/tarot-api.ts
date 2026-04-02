export type CardFilter = {
  id: string;
  label: string;
};

export type AppLocale = 'en' | 'zh';

export type CardSummary = {
  id: string;
  slug: string;
  name: string;
  arcana: string;
  suit: string | null;
  number: number | null;
  imageUrl: string;
  keywords: string[];
  description: string;
  filterKey: string | null;
};

export type CardDetail = CardSummary & {
  uprightMeaning: string;
  reversedMeaning: string;
  emotionalMeaning: string;
  relationshipMeaning: string;
  careerMeaning: string;
};

export type CardsResponse = {
  items: CardSummary[];
  total: number;
  filters: CardFilter[];
};

export type ReadingCard = {
  cardId: string;
  slug: string;
  name: string;
  arcana: string;
  suit: string | null;
  number: number | null;
  imageUrl: string;
  keywords: string[];
  orientation: 'upright' | 'reversed';
  position: 'single' | 'past' | 'present' | 'future';
  positionLabel: string;
  meaning: string;
  context: string;
};

export type SingleInterpretation = {
  firstImpression: string;
  whatIsEmerging: string;
  deeperReading: string;
  guidance: string;
  reflectionPrompt: string;
};

export type ThreeCardInterpretation = {
  firstImpression: string;
  whatIsEmerging: string;
  deeperReading: string;
  tensionOrTransition: string;
  guidance: string;
  reflectionPrompt: string;
  positionInsights: Array<{
    position: 'past' | 'present' | 'future';
    title: string;
    summary: string;
  }>;
};

export type ReadingResponse = {
  id: string;
  question: string;
  spreadType: 'single' | 'three';
  createdAt: string;
  cards: ReadingCard[];
  interpretation: SingleInterpretation | ThreeCardInterpretation;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const missingApiBaseUrlMessage =
  'NEXT_PUBLIC_API_BASE_URL is not configured for the web app.';

function getApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!value) {
    throw new Error(missingApiBaseUrlMessage);
  }

  return value.replace(/\/+$/, '');
}

async function parseError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string | string[] };

    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }

    return data.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

async function apiRequest<T>(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      cache: init?.cache ?? 'no-store',
      headers,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === missingApiBaseUrlMessage) {
        throw error;
      }

      throw new Error(
        `Unable to reach API endpoint. Check NEXT_PUBLIC_API_BASE_URL and CORS settings. (${error.message})`,
      );
    }

    throw new Error(
      'Unable to reach API endpoint. Check NEXT_PUBLIC_API_BASE_URL and CORS settings.',
    );
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseError(response));
  }

  return (await response.json()) as T;
}

function withLocale(path: string, locale?: AppLocale) {
  if (!locale) {
    return path;
  }

  const [pathname, search = ''] = path.split('?');
  const params = new URLSearchParams(search);
  params.set('locale', locale);

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export async function getCards(locale?: AppLocale) {
  return apiRequest<CardsResponse>(withLocale('/cards', locale));
}

export async function getCard(slug: string, locale?: AppLocale) {
  return apiRequest<CardDetail>(withLocale(`/cards/${slug}`, locale));
}

export async function getReading(id: string, locale?: AppLocale) {
  return apiRequest<ReadingResponse>(withLocale(`/readings/${id}`, locale));
}

export async function createSingleReading(question: string, locale?: AppLocale) {
  return apiRequest<ReadingResponse>(withLocale('/readings/single', locale), {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}

export async function createThreeReading(question: string, locale?: AppLocale) {
  return apiRequest<ReadingResponse>(withLocale('/readings/three', locale), {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}
