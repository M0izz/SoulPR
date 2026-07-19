import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const signers = await ethers.getSigners();
  const backendMinter = process.env.BACKEND_MINTER_ADDRESS || signers[0].address;
  console.log(`[Deploy] Using backend minter address: ${backendMinter}`);

  const Factory = await ethers.getContractFactory("SoulPR");
  const contract = await Factory.deploy(backendMinter);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`SoulPR deployed to ${address} on ${network.name}`);

  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, `${network.name}.json`),
    JSON.stringify({ address, backendMinter, network: network.name }, null, 2)
  );
  console.log(`Wrote deployments/${network.name}.json — backend and frontend both read this file.`);

  // Write directly to frontend src deployments so Vite can load it directly
  const frontendDir = path.join(__dirname, "..", "..", "frontend", "src", "deployments");
  if (fs.existsSync(path.join(__dirname, "..", "..", "frontend"))) {
    fs.mkdirSync(frontendDir, { recursive: true });
    fs.writeFileSync(
      path.join(frontendDir, `${network.name}.json`),
      JSON.stringify({ address, backendMinter, network: network.name }, null, 2)
    );
    console.log(`Wrote deployments/${network.name}.json to frontend/src/deployments/`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
