import React, { useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { createRoot } from 'react-dom/client';
import { Button } from 'primereact/button';
import { setSelectCallback } from './setup-select-callback';
import { createDebugLogger } from '@polyphra/ui-core/src/logger';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { MainDialog } from '@polyphra/ui-core/src/main-dialog';

import { Dialog } from 'primereact/dialog';
import { PolyphraApiClient } from '@polyphra/ui-core/src/api';
import { useSingleton } from 'foxact/use-singleton';
import { ApiProvider } from '@polyphra/ui-core/src/app';

const logger = createDebugLogger('components:content-script-app');

const App: React.FC<{revivedAuthToken?: string}> = (props) => {
  const toastRef = React.useRef<Toast>(null);
  const apiClientRef = useSingleton(() =>
    new PolyphraApiClient(
      localStorage.getItem('polyphra_api_url') || 'https://polyphra-api.ihate.work',
      props.revivedAuthToken || undefined,
      newToken => {
        authToken.setValue(newToken), logger('Auth token saved', newToken);
      },
    )
  );

  const overlayPanelRef = React.useRef<OverlayPanel>(null);
  const [textSelection, setTextSelection] = React.useState<string | null>(
    null,
    // "I'm very happy because the weather is nice today.",
  );
  const [showDialog, setShowDialog] = React.useState(false);
  useEffect(() => {
    toastRef.current?.show({
      id: 'app-mounted',
      content: 'Polyphra running. Select some text!',
      severity: 'info',
      closable: false,
      life: 5e3,
    });
  }, []);
  useEffect(() => {
    logger('app mounted');

    return setSelectCallback({
      onSelect(anchorNode, focusNode, text) {
        let n: Node | null = anchorNode;
        while (n && n.nodeType !== Node.ELEMENT_NODE) {
          n = n.parentElement;
        }
        if (n instanceof HTMLElement) {
          logger('showing tooltip', n);
          overlayPanelRef.current?.show(null, n);
          setTextSelection(text);
        }

        // logger("Selection made", anchorNode, focusNode);
      },
      onMouseDown() {
        logger('Mouse down event detected');
      },
    });
  }, []);

  return (
    <ApiProvider value={apiClientRef.current}>
      <Toast ref={toastRef} position='top-left' />
      <OverlayPanel dismissable unstyled ref={overlayPanelRef}>
        <Button
          onClick={() => {
            overlayPanelRef.current?.hide();
            setShowDialog(true);
          }}
        >
          Rephrase with Polyphra
        </Button>
      </OverlayPanel>
      {showDialog && (
        <MainDialog
          visible
          origText={textSelection ?? ''}
          onHide={() => setShowDialog(false)}
        />
      )}
    </ApiProvider>
  );
};

const DummyDialog: React.FC<{visible?: boolean; text: string; onHide(): void}> = (props) => {
  return (
    <Dialog
      visible={props.visible}
      header='Header'
      draggable={false}
      className='bg-white'
      style={{width: '80vw'}}
      position='top'
      onHide={props.onHide}
    >
      <p className='m-0'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </p>
    </Dialog>
  );
};

export function mount(container: HTMLElement, maybeShadow: ShadowRoot | Document, revivedAuthToken?: string) {
  const root = createRoot(container);
  root.render(
    // styleContainer and appendTo are required for PrimeReact to work correctly in shadow DOM
    <PrimeReactProvider
      value={{styleContainer: maybeShadow.querySelector('head')!, appendTo: maybeShadow.querySelector('body')!}}
    >
      <App revivedAuthToken={revivedAuthToken} />
    </PrimeReactProvider>,
  );
  return root;
}
