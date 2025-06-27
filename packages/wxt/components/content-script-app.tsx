import React, { createContext, StrictMode, useEffect } from 'react';
import { PrimeReactContext, PrimeReactProvider } from 'primereact/api';
import { createRoot } from 'react-dom/client';
import { Button } from 'primereact/button';
import { setSelectCallback } from './setup-select-callback';
import { createDebugLogger } from './logger';
// import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';

import { Dialog } from 'primereact/dialog';

const logger = createDebugLogger('components:content-script-app');

const App: React.FC<{shadowBody: HTMLElement}> = (props) => {
  const toastRef = React.useRef<Toast>(null);

  const overlayPanelRef = React.useRef<OverlayPanel>(null);
  const [textSelection, setTextSelection] = React.useState<string | null>("Dismiss this");
  const [showDialog, setShowDialog] = React.useState(true);
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
    <>
      <Toast ref={toastRef} position='top-left' appendTo={props.shadowBody} />
      <OverlayPanel dismissable unstyled ref={overlayPanelRef} appendTo={props.shadowBody}>
        <Button
          onClick={() => {
            overlayPanelRef.current?.hide();
            setShowDialog(true);
          }}
        >
          Rephrase with Polyphra
        </Button>
      </OverlayPanel>
      <AppDialog
        visible={showDialog}
        shadowBody={props.shadowBody}
        text={textSelection ?? ''}
        onHide={() => setShowDialog(false)}
      />
    </>
  );
};

const AppDialog: React.FC<{shadowBody: HTMLElement; visible?: boolean; text: string; onHide(): void}> = (props) => {
  return (
    <Dialog
      visible={props.visible}
      header='Header'
      draggable={false}
      className='bg-white'
      style={{width: '80vw'}}
      position="top"
      onHide={props.onHide}
      appendTo={props.shadowBody}
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

export function mount(container: HTMLElement, shadow: ShadowRoot) {
  const root = createRoot(container);
  root.render(
    <PrimeReactProvider value={{styleContainer: shadow.querySelector('head')!}}>
      <App shadowBody={shadow.querySelector('body')!} />
    </PrimeReactProvider>,
  );
  return root;
}
