import { createDebugLogger } from '@/components/logger';
import { ResourcePool } from '@jokester/ts-commonutil/lib/concurrency/resource-pool';
const logger = createDebugLogger('polyphra:api');

export interface ActorSpec {
  id: string;
  name: string;
  acronym?: string;
  description: string;
  origin: string;
}
export class PolyphraApiClient {
  private readonly credHolder: ResourcePool<{
    authToken?: string;
    current_session?: {
      session_id: string
      user_id?: string
    }
  }>;

  constructor(private readonly baseUrl: string, authToken: string | undefined, private readonly onAuthTokenChange: (authToken: string) => void) {
    this.credHolder = ResourcePool.single({authToken});
    logger('PolyphraApiClient initialized', baseUrl, authToken);
  }

  async getActors(): Promise<ActorSpec[]> {
    const headers = await this.getOrFetchAuthToken();
    logger('Fetching actors with headers', headers);
    return this.get<ActorSpec[]>('/actors', headers);
  }

  async createParaphrase(actor: ActorSpec, text: string): Promise<{text: string}> {

    const headers = await this.getOrFetchAuthToken();
    return this.post<{text: string}>('/paraphrase/create', { actor: actor.id, text }, headers)
  }

  async createTts(actor: ActorSpec, text: string): Promise<{audio_uri: string, audio_duration: number}> {
    const headers = await this.getOrFetchAuthToken();
    return this.post('/tts/create', { actor: actor.id, text }, headers)
  }

  private async getOrFetchAuthToken(): Promise<{authorization?: string}> {
    await using t = await this.credHolder.borrow();
    if (t.value.authToken && t.value.current_session) {
      logger('Using validated auth token', t.value.authToken);
      return {authorization: `Bearer ${t.value.authToken}`};
    }

    if (t.value.authToken) {
      const resBody = await this.get<{session_id: string}>('/session/current', {authorization: `Bearer ${t.value.authToken}`}).catch(e => {
        logger('Failed to get current session', e);
        return null;
      });

      if (resBody?.session_id) {
        logger('Auth token validated', resBody.session_id);
        t.value.current_session = {...resBody}
        return {authorization: `Bearer ${t.value.authToken}`};
      }
    }

    {
      const res = await this.post<string>(`/session/create_guest_session`);
      t.value.authToken = res;
      this.onAuthTokenChange(res);

      return {authorization: `Bearer ${res}`};
    }
  }

  private async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {method: 'GET', headers: headers});
    if (!response.ok) {
      throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);
    }
    return response.json();
  }

  private async post<T>(endpoint: string, body: object = null!, headers: Record<string, string> = {}): Promise<T> {
    const mergedHeaders = {
      ...headers,
      ...body && {
      'Content-Type': 'application/json',
      }
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      ...body && {
        body: JSON.stringify(body),
      },
      headers: mergedHeaders,
    });
    if (!response.ok) {
      throw new Error(`Error posting data to ${endpoint}: ${response.statusText}`);
    }
    return response.json();
  }
}
