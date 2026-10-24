import cmd from "atocha";

describe("command", () => {
  it("should work with the basic command", async () => {
    const out = await cmd("node .");
    expect(out).toContain("MIT");
    expect(out).toMatch(/^MIT \u2014+ \d+$/m);
  });

  it("should work with the list flag", async () => {
    const out = await cmd("node . --list");
    expect(out).toContain("files@");
  });
});
