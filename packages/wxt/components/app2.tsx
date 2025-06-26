import { Button, HStack } from "@chakra-ui/react"
import React from "react"
import {Provider} from '@/src/components/ui/provider'
import { createRoot } from "react-dom/client"

export const Demo = () => {
  return (
        <Provider>
    <HStack>
      <Button>Click me</Button>
      <Button>Click me</Button>
    </HStack>
    </Provider>

  )
}

export function mount(container: HTMLElement, shadow: ShadowRoot) {
  const root = createRoot(container);
  root.render(
      <Demo />
  );
  return root;
}
