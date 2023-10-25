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
        if (register.installing) {
          console.log("正在安装");
        } else if (register.waiting) {
          console.log("已安装");
        } else if (register.active) {
          console.log("激活");
        }
      } catch (error) {
        console.log(error, "registerError");
      }
    }
  }
}
