import crypto from "crypto";

function verifyGitHubSignature(payload: Buffer, header: string | undefined, secret: string): boolean {
  if (!secret || !header) return false;

  const expected = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")}`;

  try {
    return (
      expected.length === header.length &&
      crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(header, "utf8"))
    );
  } catch {
    return false;
  }
}

describe("GitHub Webhook HMAC validation", () => {
  const secret = "supersecret";
  const payload = Buffer.from(JSON.stringify({ action: "closed", merged: true }));

  it("should validate a correct signature successfully", () => {
    const signature = `sha256=${crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")}`;

    const isValid = verifyGitHubSignature(payload, signature, secret);
    expect(isValid).toBe(true);
  });

  it("should reject an incorrect signature", () => {
    const isValid = verifyGitHubSignature(payload, "sha256=invalid_hash_value", secret);
    expect(isValid).toBe(false);
  });

  it("should reject when signature is missing", () => {
    const isValid = verifyGitHubSignature(payload, undefined, secret);
    expect(isValid).toBe(false);
  });
});
