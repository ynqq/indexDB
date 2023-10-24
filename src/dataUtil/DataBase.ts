import DataBaseError, { ErrorEnums } from "./Error";
import { sleep } from "./util";

export interface IDataBaseOptions {
  name: string;
  version: number;
  tableList: Record<
    string,
    { storeName: string; version: number; keyPath: string }
  >;
}

export default class DataBase {
  public name: string;
  public version: number;
  private db!: IDBDatabase;
  private options: IDataBaseOptions;
  private constructor(options: IDataBaseOptions) {
    this.name = options.name;
    this.version = options.version;
    this.options = options;
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
        for (let i in this.options.tableList) {
          const tableItem = this.options.tableList[i];
          if (!this.db.objectStoreNames.contains(tableItem.storeName)) {
            this.db.createObjectStore(tableItem.storeName, {
              keyPath: tableItem.keyPath,
            });
          }
        }
        resolve(true);
      };
    });
  }
  static async getDB(options: IDataBaseOptions) {
    const obj = new this(options);
    await obj.init();
    await sleep(300);
    return obj.db!;
  }
}
