import dbService from "../services/DbService";

describe("DbService pending mint cleanup", () => {
  it("preserves queue entries added after the mint drain snapshot", async () => {
    const processed = {
      repo: "owner/repo",
      prNumber: 1,
      prTitle: "processed",
      githubUsername: "contributor",
      mergeTimestamp: 1000,
      commitSha: "processed",
    };
    const later = { ...processed, prNumber: 2, prTitle: "arrived later", commitSha: "later" };
    await dbService.addPendingMint(processed);
    await dbService.addPendingMint(later);

    await dbService.deletePendingMints("contributor", [processed]);

    expect(await dbService.getPendingMints("contributor")).toEqual([later]);
    await dbService.deletePendingMints("contributor");
  });

  it("deletes pending mints in batches no larger than Firestore's 500-write limit", async () => {
    const service = dbService as any;
    const previousFallback = service.isFallback;
    const previousDb = service.db;
    const docs = Array.from({ length: 1001 }, (_, index) => ({ ref: { id: String(index) } }));
    const deleteDoc = jest.fn();
    const commit = jest.fn().mockResolvedValue(undefined);
    const batch = jest.fn(() => ({ delete: deleteDoc, commit }));
    const get = jest.fn().mockResolvedValue({ docs });
    const where = jest.fn().mockReturnValue({ get });
    const collection = jest.fn().mockReturnValue({ where });
    service.isFallback = false;
    service.db = { collection, batch };

    try {
      await service.deletePendingMints("contributor");

      expect(batch).toHaveBeenCalledTimes(3);
      expect(deleteDoc).toHaveBeenCalledTimes(1001);
      expect(commit).toHaveBeenCalledTimes(3);
    } finally {
      service.isFallback = previousFallback;
      service.db = previousDb;
    }
  });
});
