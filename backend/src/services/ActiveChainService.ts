import nearChainService from "./NearChainService";
import type { IChainService } from "./MintService";

/** Select active NEAR minting backend. */
export function getActiveChainService(): IChainService {
  return nearChainService;
}

export const activeChainService = getActiveChainService();
export default activeChainService;
