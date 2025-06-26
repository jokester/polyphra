import React, { createContext, StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  Dialog,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  ChakraProvider,
  EnvironmentProvider
} from '@chakra-ui/react';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { setSelectCallback } from './setup-select-callback';
import { createDebugLogger } from './logger';
import { toaster } from '../src/components/ui/toaster';
import { system } from '../src/components/ui/system';

const logger = createDebugLogger('components:content-script-app');

const App: React.FC<{shadowBody: HTMLElement}> = (props) => {
  const [textSelection, setTextSelection] = React.useState<string | null>("Dismiss this");
  const [showDialog, setShowDialog] = React.useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<HTMLElement | null>(null);

  useEffect(() => {
    toaster.create({
      id: 'app-mounted',
      title: 'Polyphra running. Select some text!',
      status: 'info',
      duration: 5000,
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
          logger('showing popover', n);
          setPopoverAnchorEl(n);
          setIsPopoverOpen(true);
          setTextSelection(text);
        }
      },
      onMouseDown() {
        logger('Mouse down event detected');
        setIsPopoverOpen(false);
      },
    });
  }, []);

  return (
    <>
      <Popover.Root
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        placement="auto"
        closeOnBlur={true}
      >
        <PopoverTrigger>
          <div style={{ position: 'absolute', left: -9999, top: -9999 }} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <Button
              onClick={() => {
                setIsPopoverOpen(false);
                setShowDialog(true);
              }}
            >
              Rephrase with Polyphra
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover.Root>

      <Dialog.Root
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        size="xl"
      >
        <Dialog.Trigger />
        <Dialog.Backdrop/>
        <Dialog.Positioner>
              <Dialog.Content>
      <Dialog.CloseTrigger />
      <Dialog.Header>
        <Dialog.Title >TITIE</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body />
      <Dialog.Footer />
    </Dialog.Content>
      </Dialog.Positioner>
      </Dialog.Root>

      {/* <AppDialog
        visible={showDialog}
        shadowBody={props.shadowBody}
        text={textSelection ?? ''}
        onHide={() => setShowDialog(false)}
      /> */}
    </>
  );
};

const AppDialog: React.FC<{shadowBody: HTMLElement; visible?: boolean; text: string; onHide(): void}> = (props) => {
  return (
    <Modal
      isOpen={props.visible}
      onClose={props.onHide}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Header</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export function mount(container: HTMLElement, shadow: ShadowRoot) {
  const shadowBody = shadow.querySelector('body')!;

  // Create emotion cache for shadow DOM
  const emotionCache = createCache({
    key: "polyphra-root",
    container: shadow,
  });

  const root = createRoot(container);
  root.render(
    <EnvironmentProvider value={() => shadow}>
      <CacheProvider value={emotionCache}>
        <ChakraProvider value={system}>
          <App shadowBody={shadowBody} />
        </ChakraProvider>
      </CacheProvider>
    </EnvironmentProvider>
  );
  return root;
}
