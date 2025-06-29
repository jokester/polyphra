import debugModule from 'debug';
export function createDebugLogger(namespace: string) {
  return debugModule(`wxt:${namespace}`) as debugModule.IDebugger;
  return (...args: any[]) => {
    console.debug(`wxt:${namespace}`, ...args);
  };
}
