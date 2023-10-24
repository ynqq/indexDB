import { ActionRes, ErrorEnums, IActionProps } from "./Error";

export interface IStoreObjectOptions {
  db: IDBDatabase;
  storeName: string;
  keyPath: string;
}

export default class StoreObject<T> {
  private db: IDBDatabase;
  private storeName: string;
  constructor(options: IStoreObjectOptions) {
    this.db = options.db;
    this.storeName = options.storeName;
    this.init();
  }
  init() {}
  getName() {
    return this.storeName;
  }
  add(storeData: T): Promise<IActionProps<T>> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction([this.storeName], "readwrite")
        .objectStore(this.storeName)
        .add(storeData);
      req.onerror = () => {
        reject(ActionRes.error(ErrorEnums.WRITE_ERROR));
      };
      req.onsuccess = () => {
        resolve(ActionRes.success(storeData));
      };
    });
  }
  get(id: number): Promise<IActionProps<T>> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction([this.storeName], "readonly")
        .objectStore(this.storeName)
        .get(id);
      req.onerror = () => {
        reject(ActionRes.error(ErrorEnums.SELECT_ERROR));
      };
      req.onsuccess = (e: any) => {
        if (e.target.result === undefined) {
          resolve(ActionRes.noData());
        } else {
          resolve(ActionRes.success(e.target.result));
        }
      };
    });
  }
  getAll(): Promise<IActionProps<T[]>> {
    return new Promise((resolve, reject) => {
      const req = this.db
        .transaction([this.storeName], "readonly")
        .objectStore(this.storeName)
        .getAll();
      req.onerror = () => {
        reject(ActionRes.error(ErrorEnums.SELECT_ERROR));
      };
      req.onsuccess = (e: any) => {
        resolve(ActionRes.success(e.target.result));
      };
    });
  }
  async update(id: number, data: T): Promise<IActionProps<T>> {
    const res = await this.get(id);
    if (res.code === 0) {
      return new Promise((resolve, reject) => {
        const req = this.db
          .transaction([this.storeName], "readwrite")
          .objectStore(this.storeName)
          .put(data);
        req.onerror = () => {
          reject(ActionRes.error(ErrorEnums.WRITE_ERROR));
        };
        req.onsuccess = (e: any) => {
          resolve(ActionRes.success(e.target.result));
        };
      });
    } else {
      return Promise.reject(ActionRes.noData());
    }
  }
  delete(id: number): Promise<IActionProps<number>> {
    return new Promise(async (resolve, reject) => {
      const res = await this.get(id);
      if (res.code !== 0) {
        return reject(ActionRes.noData());
      }
      const req = this.db
        .transaction([this.storeName], "readwrite")
        .objectStore(this.storeName)
        .delete(id);
      req.onerror = () => {
        reject(ActionRes.error(ErrorEnums.DELETE_ERROR));
      };
      req.onsuccess = () => {
        resolve(ActionRes.success(id));
      };
    });
  }
  remove() {
    this.db.deleteObjectStore(this.storeName);
    return ActionRes.success(true);
  }
}
