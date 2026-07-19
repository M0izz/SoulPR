// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SoulPR
 * @notice Soulbound ERC-721 that records merged GitHub pull requests on-chain.
 *         Each token represents one (contributor, repo, PR number) triple.
 *         Tokens are non-transferable by design — the transfer functions revert.
 */
contract SoulPR is ERC721, Ownable {
    using Strings for uint256;

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    error Soulbound();
    error AlreadyAttested(bytes32 key);
    error NotBackendMinter();
    error ZeroAddress();

    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    struct Attestation {
        address contributor;
        string  repo;            // "owner/name"
        uint256 prNumber;
        uint256 mergeTimestamp;  // original GitHub merge time (Unix seconds)
    }

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event Attested(
        address indexed contributor,
        string  repo,
        uint256 prNumber,
        uint256 mergeTimestamp,
        uint256 tokenId
    );

    event BackendMinterUpdated(address indexed oldMinter, address indexed newMinter);

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    address public backendMinter;
    uint256 private _tokenIdCounter = 1; // Start token ID at 1 to align with tests

    /// @notice Idempotency guard — keccak256(abi.encodePacked(repo, prNumber)) => minted
    mapping(bytes32  => bool)        public minted;

    /// @notice tokenId => Attestation data
    mapping(uint256  => Attestation) public attestations;

    /// @notice wallet => list of owned token IDs (for efficient dashboard reads)
    mapping(address  => uint256[])   private _tokensByOwner;

    // -------------------------------------------------------------------------
    // Modifiers
    // -------------------------------------------------------------------------

    modifier onlyBackend() {
        if (msg.sender != backendMinter) revert NotBackendMinter();
        _;
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(address _backendMinter) ERC721("SoulPR Contribution Badge", "SOULPR") Ownable(msg.sender) {
        if (_backendMinter == address(0)) revert ZeroAddress();
        backendMinter = _backendMinter;
    }

    // -------------------------------------------------------------------------
    // Core: attest
    // -------------------------------------------------------------------------

    /**
     * @notice Mint a soulbound badge for a merged pull request.
     */
    function attest(
        address contributor,
        string calldata repo,
        uint256 prNumber,
        uint256 mergeTimestamp
    ) external onlyBackend {
        bytes32 key = keccak256(abi.encodePacked(repo, prNumber));
        if (minted[key]) revert AlreadyAttested(key);

        minted[key] = true;

        uint256 tokenId = _tokenIdCounter++;
        _mint(contributor, tokenId);

        attestations[tokenId] = Attestation({
            contributor: contributor,
            repo:            repo,
            prNumber:        prNumber,
            mergeTimestamp:  mergeTimestamp
        });

        _tokensByOwner[contributor].push(tokenId);

        emit Attested(contributor, repo, prNumber, mergeTimestamp, tokenId);
    }

    // -------------------------------------------------------------------------
    // Views
    // -------------------------------------------------------------------------

    /**
     * @notice Returns all token IDs owned by a wallet.
     */
    function tokensByOwner(address owner) external view returns (uint256[] memory) {
        return _tokensByOwner[owner];
    }

    /**
     * @notice Returns inline base64-encoded JSON metadata.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        Attestation memory a = attestations[tokenId];

        // Generate base64 SVG representation of the badge
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">',
            '<rect width="200" height="200" fill="#1b1815"/>',
            '<text x="20" y="80" font-family="sans-serif" font-size="16" fill="#ff6a1a" font-weight="bold">SoulPR Badge</text>',
            '<text x="20" y="110" font-family="sans-serif" font-size="12" fill="#f2ede6">#', prNumberToString(a.prNumber), '</text>',
            '<text x="20" y="130" font-family="sans-serif" font-size="10" fill="#a69c8d">', a.repo, '</text>',
            '</svg>'
        ));

        string memory imageURI = string(abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(bytes(svg))
        ));

        string memory json = string(abi.encodePacked(
            '{"name":"SoulPR Contribution Badge #', tokenId.toString(), '",',
            '"description":"Soulbound on-chain proof of an open-source contribution. Non-transferable.",',
            '"image":"', imageURI, '",',
            '"attributes":[',
                '{"trait_type":"Repository","value":"',  a.repo, '"},',
                '{"trait_type":"Pull Request","value":"#', a.prNumber.toString(), '"},',
                '{"trait_type":"Contributor","value":"',  Strings.toHexString(a.contributor), '"},',
                '{"trait_type":"Merged","value":',        a.mergeTimestamp.toString(), '},',
                '{"trait_type":"Network","value":"Monad testnet"}',
            ']}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    function prNumberToString(uint256 value) internal pure returns (string memory) {
        return value.toString();
    }

    // -------------------------------------------------------------------------
    // Admin
    // -------------------------------------------------------------------------

    /**
     * @notice Update the backend minter address.
     */
    function setBackendMinter(address newMinter) external onlyOwner {
        if (newMinter == address(0)) revert ZeroAddress();
        emit BackendMinterUpdated(backendMinter, newMinter);
        backendMinter = newMinter;
    }

    // -------------------------------------------------------------------------
    // Soulbound: block all transfers
    // -------------------------------------------------------------------------

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
        revert Soulbound();
    }

    function setApprovalForAll(address, bool) public pure override {
        revert Soulbound();
    }
}
