import chainService from "./ChainService";
import nearChainService from "./NearChainService";
import type { IChainService } from "./MintService";

/** Select exactly one minting backend at startup. */
export function getActiveChainService(): IChainService {
  const provider = (process.env.CHAIN_PROVIDER ?? "near").toLowerCase();
  if (provider === "near") return nearChainService;
  if (provider === "monad") return chainService;
  throw new Error(`Unsupported CHAIN_PROVIDER '${provider}'. Use 'near' or 'monad'.`);
}

export const activeChainService = getActiveChainService();
export default activeChainService;