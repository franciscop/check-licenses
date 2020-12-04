import checkNodeVersion from "./checkNodeVersion.js";

describe("checkNodeVersion.js", () => {
  it("can validate a smaller string", () => {
    expect(() => {
      checkNodeVersion("v1.1.1", "v1.1.2");
    }).not.toThrow();
    expect(() => {
      checkNodeVersion("v1.1.1", "v1.2.1");
    }).not.toThrow();
    expect(() => {
      checkNodeVersion("v1.1.1", "v2.1.1");
    }).not.toThrow();
  });

  it("can validate the same version", () => {
    expect(() => {
      checkNodeVersion("v1.1.1", "v1.1.1");
    }).not.toThrow();
    expect(() => {
      checkNodeVersion("v1.1.1", "1.1.1");
    }).not.toThrow();
    expect(() => {
      checkNodeVersion("1.1.1", "v1.1.1");
    }).not.toThrow();
    expect(() => {
      checkNodeVersion("1.1.1", "1.1.1");
    }).not.toThrow();
  });

  it("throws when invalid validate the same version", () => {
    expect(() => {
      checkNodeVersion("v20.20.20", "v1.1.1");
    }).toThrow();
    expect(() => {
      checkNodeVersion("v1.1.2", "v1.1.1");
    }).toThrow();
    expect(() => {
      checkNodeVersion("v1.2.1", "v1.1.1");
    }).toThrow();
    expect(() => {
      checkNodeVersion("v2.1.1", "v1.1.1");
    }).toThrow();
  });
});
