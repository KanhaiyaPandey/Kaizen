import { describe, expect, it } from "vitest";
import { healthHandler } from "../routes/health.js";

describe("health route", () => {
  it("returns ok status", async () => {
    let payload: { ok: true } | undefined;

    healthHandler(undefined, {
      json(body) {
        payload = body;
      }
    });

    expect(payload).toEqual({ ok: true });
  });
});
