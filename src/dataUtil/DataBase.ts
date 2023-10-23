import DataBaseError, { ErrorEnums } from "./Error";

interface IDataBaseOptions {
  name: string;
  version: number;
}

export default class DataBase {
  public name: string;
  public version: number;
  private db: IDBDatabase | undefined;
  private constructor(options: IDataBaseOptions) {
    this.name = options.name;
    this.version = options.version;
  }
  init() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.name);
      request.onerror = () => {
        reject(new DataBaseError(ErrorEnums.OPEN_ERROR));
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };
      request.onupgradeneeded = (e: any) => {
        this.db = e.target.result;
        resolve(true);
      };
    });
  }
  static async getDB(options: IDataBaseOptions) {
    const obj = new this(options);
    await obj.init();
    return obj.db!;
  }
}
