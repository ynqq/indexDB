import DataBase, { IDataBaseOptions } from "./dataUtil/DataBase";
import StoreObject from "./dataUtil/StoreObject";
import "./style.css";
import SWIndex from "../public/serviceWorker.js";

interface IDataItem {
  info: string;
  id: number;
}

const addBtn = document.querySelector<HTMLDivElement>(".addBtn")!;
const todoListContainer = document.querySelector<HTMLDivElement>(".todoList")!;
const todoValue = document.querySelector<HTMLInputElement>("#todoValue")!;

class Index {
  private db!: IDBDatabase;
  private todoList!: StoreObject<IDataItem>;
  private flag: "add" | "edit" | "delete" = "add";
  private dbOptions: IDataBaseOptions;
  actionId: number;
  constructor() {
    console.log("????new----");

    this.flag = "add";
    this.actionId = -1;
    this.dbOptions = {
      name: "demo",
      version: 1,
      tableList: {
        todoList: { storeName: "todoList", keyPath: "id", version: 1 },
      },
    };
    this.init();
  }
  async init() {
    this.db = await DataBase.getDB(this.dbOptions);
    this.todoList = new StoreObject({
      ...this.dbOptions.tableList.todoList,
      db: this.db,
    });
    this.initSW();
    this.initPage();
    this.addEvent();
  }
  initSW() {
    new SWIndex();
  }
  async initPage() {
    todoListContainer.innerHTML = "";
    const res = await this.todoList.getAll();
    if (res.code === 0) {
      res.data.forEach((item) => {
        this.addItem(item);
      });
    }
  }
  addEvent() {
    addBtn.addEventListener("click", () => {
      const value = todoValue.value.trim();
      if (value !== "") {
        if (this.flag === "add") {
          this.addItem(
            {
              info: value,
              id: Date.now(),
            },
            { save: true }
          );
        } else if (this.flag === "edit") {
          this.updateItem({
            info: value,
            id: this.actionId,
          });
        }
        todoValue.value = "";
      }
    });

    todoListContainer.addEventListener("click", async (e: any) => {
      const el = e.target as HTMLDivElement;
      const classList = el.classList;

      if (classList.contains("delete")) {
        this.flag = "delete";
        this.actionId = +el.getAttribute("data-id")!;
        await this.todoList.delete(this.actionId);
        this.initPage();
      } else if (classList.contains("edit")) {
        this.flag = "edit";
        this.actionId = +el.getAttribute("data-id")!;
        const res = await this.todoList.get(this.actionId);
        if (res.code === 0) {
          todoValue.value = res.data.info;
        }
      }
    });
  }
  reset() {
    this.flag = "add";
    this.actionId = -1;
  }
  addItem(data: IDataItem, options?: { save: boolean }) {
    options = options || { save: false };
    const html = `<div class="todoInfo">
      <div class="todoTitle">${data.id}</div>
      <div class="todoText">${data.info}</div>
    </div>
    <div class="todoControl">
      <div class="todoBtn edit" data-id="${data.id}">修改</div>
      <div class="todoBtn delete" data-id="${data.id}">删除</div>
    </div>`;
    const todoDiv = document.createElement("div");
    todoDiv.className = "todoItem";
    todoDiv.setAttribute("data-id", data.id + "");
    todoDiv.innerHTML = html;
    todoListContainer.appendChild(todoDiv);
    if (options.save) {
      this.todoList.add(data);
    }
  }
  async updateItem(data: IDataItem) {
    const res = await this.todoList.update(this.actionId, data);
    if (res.code === 0) {
      this.initPage();
    }
  }
}

new Index();

