import cmd from "atocha";

describe("command", () => {
  it("should work with the basic command", async () => {
    const out = await cmd("node .");
    expect(out).toContain("MIT");
    expect(out).toContain("ISC");
    expect(out).toContain("CC0-1.0");
    expect(out).toContain("BSD-2-Clause");
  });

  it("should work with the list flag", async () => {
    const out = await cmd("node . --list");
    expect(out).toContain("files@");
  });
});
