import { ContentScriptContext } from 'wxt/dist/utils/content-script-context';
import { mount } from '../components/content-script-app';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx: ContentScriptContext) {
    // Executed when content script is loaded, can be async
    console.info('content script running');

    const ui = await createShadowRootUi(ctx, {
      name: 'polyphra-content-script-ui',
      position: 'inline',
      anchor: 'body',
      onMount(container: HTMLElement) {
        // Define how your UI will be mounted inside the container
        // const app = document.createElement('p');
        // app.textContent = 'Hello world!';
        // container.append(app);
        mount(container);
      },
    });

    ui.mount();
  },
});
