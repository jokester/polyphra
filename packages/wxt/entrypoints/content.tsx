import type { ContentScriptContext } from 'wxt/dist/utils/content-script-context';
// import { mount } from '../components/content-script-app'
// import 'primereact/resources/themes/lara-light-cyan/theme.css';
// import "@/components/styles.css";
// for unknown reason this has to be imported later
// import 'primereact/resources/themes/fluent-light/theme.css';
import {mount} from '../components/content-script-app'

const shadowRootConfig = {
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx: ContentScriptContext) {
    // Executed when content script is loaded, can be async
    console.info('content script running');

    const ui = await createShadowRootUi(ctx, {
      name: 'polyphra-content-script-ui',
      position: 'inline',
      anchor: 'body',
      append: 'first',
      async onMount(container: HTMLElement, shadow: ShadowRoot) {
        mount(container, shadow)
      },
    });

    ui.mount();
  },
}

const unusedConfig2 = {
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  main(ctx: ContentScriptContext) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container: HTMLElement) => {
        mount(container, null!)
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },

}
export default defineContentScript( shadowRootConfig);