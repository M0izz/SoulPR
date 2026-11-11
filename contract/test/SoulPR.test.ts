import { expect } from "chai";
import { ethers } from "hardhat";

describe("SoulPR", function () {
  async function deploy() {
    const [owner, backend, contributor, stranger] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SoulPR");
    const contract = await Factory.deploy(backend.address);
    return { contract, owner, backend, contributor, stranger };
  }

  it("mints and emits Attested with the correct data", async function () {
    const { contract, backend, contributor } = await deploy();
    const mergeTimestamp = Math.floor(Date.now() / 1000);

    await expect(contract.connect(backend).attest(contributor.address, "moizz/CNTRL", 38, "Merkle Tree optimization for DEX protocol", "moizz", "sha123", mergeTimestamp))
      .to.emit(contract, "Attested")
      .withArgs(contributor.address, "moizz/CNTRL", 38, "Merkle Tree optimization for DEX protocol", "moizz", "sha123", mergeTimestamp, 1);

    expect(await contract.ownerOf(1)).to.equal(contributor.address);
  });

  it("reverts on a duplicate (repo, prNumber) attestation", async function () {
    const { contract, backend, contributor } = await deploy();
    await contract.connect(backend).attest(contributor.address, "moizz/CNTRL", 38, "Title", "moizz", "sha123", 1000);

    await expect(
      contract.connect(backend).attest(contributor.address, "moizz/CNTRL", 38, "Title", "moizz", "sha123", 1000)
    ).to.be.revertedWithCustomError(contract, "AlreadyAttested");
  });

  it("reverts on transferFrom — soulbound", async function () {
    const { contract, backend, contributor, stranger } = await deploy();
    await contract.connect(backend).attest(contributor.address, "moizz/CNTRL", 38, "Title", "moizz", "sha123", 1000);

    await expect(
      contract.connect(contributor).transferFrom(contributor.address, stranger.address, 1)
    ).to.be.revertedWithCustomError(contract, "Soulbound");
  });

  it("reverts if a non-backend address calls attest", async function () {
    const { contract, contributor, stranger } = await deploy();
    await expect(
      contract.connect(stranger).attest(contributor.address, "moizz/CNTRL", 38, "Title", "moizz", "sha123", 1000)
    ).to.be.revertedWithCustomError(contract, "NotBackendMinter");
  });

  it("returns a parseable tokenURI with the correct base64 JSON", async function () {
    const { contract, backend, contributor } = await deploy();
    await contract.connect(backend).attest(contributor.address, "moizz/CNTRL", 38, "Title", "moizz", "sha123", 1752300000);

    const uri = await contract.tokenURI(1);
    expect(uri).to.match(/^data:application\/json;base64,/);

    const json = Buffer.from(uri.split(",")[1], "base64").toString("utf-8");
    const parsed = JSON.parse(json);
    expect(parsed.attributes[0].value).to.equal("moizz/CNTRL");
    expect(parsed.image).to.match(/^data:image\/svg\+xml;base64,/);
  });

  it("escapes JSON and SVG metadata supplied by contributors", async function () {
    const { contract, backend, contributor } = await deploy();
    const repo = 'owner/<script>alert("x")</script>&';
    const title = 'Fix "metadata"\\path\nnext line';
    await contract.connect(backend).attest(contributor.address, repo, 8, title, 'user"\\name', "sha\nvalue", 1000);

    const uri = await contract.tokenURI(1);
    const parsed = JSON.parse(Buffer.from(uri.split(",")[1], "base64").toString("utf-8"));
    expect(parsed.description).to.equal(title);
    expect(parsed.attributes[0].value).to.equal(repo);
    expect(parsed.attributes[3].value).to.equal('user"\\name');

    const svg = Buffer.from(parsed.image.split(",")[1], "base64").toString("utf-8");
    expect(svg).to.include("owner/&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;&amp;");
    expect(svg).not.to.include("<script>");
  });

  it("implements the ERC-5192 locked interface", async function () {
    const { contract, backend, contributor } = await deploy();
    await contract.connect(backend).attest(contributor.address, "moizz/CNTRL", 38, "Title", "moizz", "sha123", 1000);

    expect(await contract.locked(1)).to.equal(true);
    expect(await contract.supportsInterface("0xb45a3c0e")).to.equal(true);
    await expect(contract.locked(999)).to.be.reverted;
  });

  it("populates tokensByOwner correctly across multiple mints", async function () {
    const { contract, backend, contributor } = await deploy();
    await contract.connect(backend).attest(contributor.address, "moizz/CNTRL", 38, "Title", "moizz", "sha123", 1000);
    await contract.connect(backend).attest(contributor.address, "moizz/JugaadLang", 20, "Title2", "moizz", "sha456", 2000);

    const tokens = await contract.tokensByOwner(contributor.address);
    expect(tokens.map((t: bigint) => Number(t))).to.deep.equal([1, 2]);
  });

  it("lets the owner rotate the backend minter", async function () {
    const { contract, owner, backend, contributor, stranger } = await deploy();
    await contract.connect(owner).setBackendMinter(stranger.address);

    await expect(
      contract.connect(backend).attest(contributor.address, "moizz/CNTRL", 38, "Title", "moizz", "sha123", 1000)
    ).to.be.revertedWithCustomError(contract, "NotBackendMinter");

    await expect(contract.connect(stranger).attest(contributor.address, "moizz/CNTRL", 38, "Title", "moizz", "sha123", 1000)).to.not.be.reverted;
  });
});
