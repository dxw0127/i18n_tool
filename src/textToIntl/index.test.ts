import { isChinese } from "./index";

describe("test is chinese text", () => {
  test("no chinese text", () => {
    expect(isChinese("this is no chinese")).toBe(false);
  });

  test("all chinese text", () => {
    expect(isChinese("这是一句中文")).toBe(true);
  });

  test("mixin chinese text", () => {
    expect(isChinese("这是一句Chinese Text")).toBe(false);
  });
});
