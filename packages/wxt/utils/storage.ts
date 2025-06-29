import { storage } from '#imports';
export const authToken = storage.defineItem<string>('sync:auth_token');
