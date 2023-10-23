export default class Empty {
  public name: string;
  constructor() {
    this.name = "Empty";
  }
  static isEmpty(source: any) {
    return source instanceof this;
  }
}
