import { createDebugLogger } from '@polyphra/ui-core/src/logger';
import { mount } from './app'
const logger = createDebugLogger('main', 'site')

mount(document.getElementById('root')!, document, localStorage.getItem('polyphra_auth_token') || undefined);