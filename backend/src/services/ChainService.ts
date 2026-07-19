import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

class ChainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    const rpcUrl = process.env.MONAD_RPC_URL ?? "https://testnet-rpc.monad.xyz";
    const privateKey = process.env.BACKEND_WALLET_PRIVATE_KEY;
    let contractAddress = process.env.CONTRACT_ADDRESS;

    if (!privateKey) {
      console.warn("[ChainService] BACKEND_WALLET_PRIVATE_KEY not set. Attest transactions will fail.");
      return;
    }

    try {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);

      // Auto-load contract address from Hardhat deployment if not in env
      if (!contractAddress) {
        const deploymentPath = path.join(__dirname, "../../../contract/deployments/monadTestnet.json");
        if (fs.existsSync(deploymentPath)) {
          const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
          contractAddress = deployment.address;
          console.log(`[ChainService] Auto-loaded contract address from deployment file: ${contractAddress}`);
        }
      }

      if (!contractAddress) {
        console.warn("[ChainService] CONTRACT_ADDRESS not set and no deployment file found.");
        return;
      }

      // Hardcoded ABI array to prevent dependencies on Hardhat build artifact folders on hosting servers
      const SOULPR_ABI = [
        "function minted(bytes32 key) external view returns (bool)",
        "function attest(address contributor, string repo, uint256 prNumber, string prTitle, string githubUsername, string mergeCommitSha, uint256 mergeTimestamp) external returns (uint256)",
        "function attestations(uint256 tokenId) external view returns (address contributor, string repo, uint256 prNumber, string prTitle, string githubUsername, string mergeCommitSha, uint256 mergeTimestamp)",
        "function tokensByOwner(address owner) external view returns (uint256[] memory)",
        "function tokenURI(uint256 tokenId) external view returns (string memory)",
        "event Attested(address indexed contributor, string repo, uint256 prNumber, string prTitle, string githubUsername, string mergeCommitSha, uint256 mergeTimestamp, uint256 indexed tokenId)"
      ];

      this.contract = new ethers.Contract(contractAddress, SOULPR_ABI, this.wallet);
      this.initialized = true;
      console.log(`[ChainService] Initialized contract minter at ${contractAddress} with wallet ${this.wallet.address}`);
    } catch (e: any) {
      console.error("[ChainService] Initialization error:", e.message);
    }
  }

  /**
   * Triggers the on-chain attest function.
   *
   * @param contributor    Wallet address of the contributor
   * @param repo           Repository identifier, e.g. "moizz/CNTRL"
   * @param prNumber       PR number
   * @param prTitle        PR title
   * @param githubUsername GitHub username of the contributor
   * @param mergeCommitSha Merge commit SHA
   * @param mergeTimestamp Unix timestamp of the merge
   * @returns Transaction hash
   */
  async attest(
    contributor: string,
    repo: string,
    prNumber: number,
    prTitle: string,
    githubUsername: string,
    mergeCommitSha: string,
    mergeTimestamp: number
  ): Promise<string> {
    if (!this.initialized || !this.contract) {
      throw new Error("ChainService not properly initialized. Check env vars and contract compile.");
    }

    try {
      console.log(`[ChainService] Sending attest tx for ${contributor} - ${repo} #${prNumber}`);
      
      const tx = await this.contract.attest(
        contributor.toLowerCase(),
        repo,
        prNumber,
        prTitle,
        githubUsername,
        mergeCommitSha,
        mergeTimestamp
      );
      
      console.log(`[ChainService] Tx broadcasted: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`[ChainService] Tx confirmed in block ${receipt.blockNumber}`);
      
      return tx.hash;
    } catch (e: any) {
      console.error(`[ChainService] Error minting attestation for ${repo} #${prNumber}:`, e.message);
      throw e;
    }
  }

  /**
   * Helper to verify if a contribution was already minted
   */
  async isMinted(repo: string, prNumber: number, contributor: string, mergeCommitSha: string): Promise<boolean> {
    if (!this.initialized || !this.contract) return false;
    try {
      const key = ethers.solidityPackedKeccak256(
        ["string", "uint256", "address", "string"],
        [repo, prNumber, contributor.toLowerCase(), mergeCommitSha]
      );
      return await this.contract.minted(key);
    } catch {
      return false;
    }
  }
}

export const chainService = new ChainService();
export default chainService;
