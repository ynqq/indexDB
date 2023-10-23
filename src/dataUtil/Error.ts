export const ErrorEnums = {
  OPEN_ERROR: "数据库打开失败",
  WRITE_ERROR: "数据写入失败",
  SELECT_ERROR: "查询失败",
  DELETE_ERROR: "删除失败",
} as const;
export const ActionEnums = {
  SUCCESS_CODE: 0,
  SUCCESS_MSG: "操作成功",
  NO_DATA_CODE: 1,
  NO_DATA_MSG: "未查到数据",
  ERROR_CODE: 2,
  ERROR_MSG: "操作失败",
};
export interface IActionProps<T> {
  code: number;
  msg: string;
  data: T;
}
export const ActionRes: Record<
  "noData" | "success" | "error",
  <T>(...args: any[]) => IActionProps<T>
> = {
  noData() {
    return {
      code: ActionEnums.NO_DATA_CODE,
      msg: ActionEnums.NO_DATA_MSG,
      data: null as any,
    };
  },
  success<T>(data: T) {
    return {
      code: ActionEnums.SUCCESS_CODE,
      msg: ActionEnums.SUCCESS_MSG,
      data,
    };
  },
  error(msg: string) {
    return {
      code: ActionEnums.ERROR_CODE,
      msg: msg || ActionEnums.ERROR_MSG,
      data: null as any,
    };
  },
};

export default class DataBaseError extends Error {}
