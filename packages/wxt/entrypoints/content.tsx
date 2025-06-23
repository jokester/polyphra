
import {mount} from '../components/content-script-app'
export default defineContentScript({
  matches: ["*://*/*"],

  main(ctx: ContentScriptContext) {
    // Executed when content script is loaded, can be async
    console.info("content script running")

    const el = document.createElement('div')
    document.body.prepend(el)
    mount(el)
  },
});