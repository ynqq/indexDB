export default class SWIndex {
  constructor() {
    this.registerServiceWorker();
  }
  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const register = await navigator.serviceWorker.register(
          "/indexDB/sw.js?ver=1",
          { scope: "/indexDB/" }
        );
        console.log(register, "-00");
      } catch (error) {
        console.log(error, "registerError");
      }
    }
  }
}
