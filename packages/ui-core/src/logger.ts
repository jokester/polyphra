import debugModule from 'debug';
export function createDebugLogger(namespace: string, pkg: string = 'ui-core') {
  return debugModule(`polyphra:${pkg}:${namespace}`) as debugModule.IDebugger;
  return (...args: any[]) => {
    console.debug(`wxt:${namespace}`, ...args);
  };
}
