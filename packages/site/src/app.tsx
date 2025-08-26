import React, { useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { createRoot } from 'react-dom/client';
import { Button } from 'primereact/button';
import { createDebugLogger } from '@polyphra/ui-core/src/logger';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { MainDialog } from '@polyphra/ui-core/src/main-dialog';

import { Dialog } from 'primereact/dialog';
import { PolyphraApiClient, DummyApiClient } from '@polyphra/ui-core/src/api';
import { useSingleton } from 'foxact/use-singleton';
import { ApiProvider } from '@polyphra/ui-core/src/app';
import './main.css'

const logger = createDebugLogger('components:content-script-app');

const App: React.FC<{ revivedAuthToken?: string | null, useDummyClient?: boolean }> = (props) => {
    const toastRef = React.useRef<Toast>(null);
    const apiClientRef = useSingleton(() =>
        new (props.useDummyClient ? DummyApiClient : PolyphraApiClient)(
            localStorage.getItem('polyphra_api_url') || 'https://polyphra-api.ihate.work',
            props.revivedAuthToken || undefined,
            newToken => {
                localStorage.setItem('polyphra_auth_token', newToken);
            },
        )
    );

    const overlayPanelRef = React.useRef<OverlayPanel>(null);
    const [showDialog, setShowDialog] = React.useState(false);
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
            {
                // <DummyDialog /> ||
                <MainDialog onHide={() => setShowDialog(false)} visible />
            }
        </ApiProvider>
    );
};

const DummyDialog: React.FC<{}> = (props) => {
    return (
        <Dialog
            visible
            header='Header'
            draggable
            style={{ width: '80vw' }}
            position='top'
            onHide={() => { }}
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
            value={{ styleContainer: maybeShadow.querySelector('head')!, appendTo: maybeShadow.querySelector('body')! }}
        >
            <App revivedAuthToken={revivedAuthToken} />
        </PrimeReactProvider>,
    );
    return root;
}
