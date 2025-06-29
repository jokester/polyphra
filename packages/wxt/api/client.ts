import { createDebugLogger } from '@/components/logger';
import { ResourcePool } from '@jokester/ts-commonutil/lib/concurrency/resource-pool';
const logger = createDebugLogger('polyphra:api');

export interface ActorSpec {
  id: string;
  name: string;
  description: string;
  origin: string;
}
export class PolyphraApiClient {
  private readonly authTokenHolder: ResourcePool<{
    authToken?: string;
    sessionId?: string;
  }>;

  constructor(private readonly baseUrl: string, authToken?: string) {
    this.authTokenHolder = ResourcePool.single({authToken});
    logger('PolyphraApiClient initialized', baseUrl, authToken);
  }

  async getActors(): Promise<ActorSpec[]> {
    const headers = await this.getOrFetchAuthToken();
    logger('Fetching actors with headers', headers);
    return this.get<ActorSpec[]>('/actors', headers);
  }

  private async getOrFetchAuthToken(): Promise<{authorization?: string}> {
    await using t = await this.authTokenHolder.borrow();
    if (t.value.authToken && t.value.sessionId) {
      logger('Using validated auth token', t.value.authToken);
      return {authorization: `Bearer ${t.value.authToken}`};
    }

    if (t.value.authToken) {
      const resBody = await this.get<{session_id: string}>('/session/current').catch(e => {
        logger('Failed to get current session', e);
        return null;
      });

      if (resBody?.session_id) {
        logger('Auth token validated', resBody.session_id);
        t.value.sessionId = resBody.session_id;
        return {authorization: `Bearer ${t.value.authToken}`};
      }
    }

    {
      const res = await this.post<string>(`/session/create_guest_session`);
      t.value.authToken = res;

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
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      ...body && {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      headers,
    });
    if (!response.ok) {
      throw new Error(`Error posting data to ${endpoint}: ${response.statusText}`);
    }
    return response.json();
  }
}
