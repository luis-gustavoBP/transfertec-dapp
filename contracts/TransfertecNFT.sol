// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title TransfertecNFT - Gerencia registro de tecnologias e licenciamento via NFTs
contract TransfertecNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct TechnologyConfig {
        string tokenURI;
        uint256 priceWei;
        bool isExclusive;
        bool isRegistered;
        bool exclusiveLicensed;
        uint256 totalLicenses;
    }

    mapping(uint256 => TechnologyConfig) private _technologies; // technologyId => config

    // ======= Gestão de Papéis =======
    mapping(address => bool) private _researchers;
    mapping(address => bool) private _companies;

    address[] private _researcherList;
    address[] private _companyList;

    event TechnologyRegistered(uint256 indexed technologyId, uint256 priceWei, bool isExclusive, string tokenURI);
    event TechnologyUpdated(uint256 indexed technologyId, uint256 priceWei, bool isExclusive, string tokenURI);
    event Licensed(address indexed licensee, uint256 indexed tokenId, uint256 indexed technologyId, uint256 priceWei);

    event ResearcherAdded(address indexed account);
    event ResearcherRemoved(address indexed account);
    event CompanyAdded(address indexed account);
    event CompanyRemoved(address indexed account);

    constructor() ERC721("TransfertecNFT", "TT-NFT") Ownable(msg.sender) {}

    function mint(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        return newTokenId;
    }

    // Admin registra/atualiza tecnologia (AUIN)
    function registerTechnology(uint256 technologyId, string memory tokenURI, uint256 priceWei, bool isExclusive) external onlyOwner {
        require(technologyId != 0, "Invalid id");
        _technologies[technologyId] = TechnologyConfig({
            tokenURI: tokenURI,
            priceWei: priceWei,
            isExclusive: isExclusive,
            isRegistered: true,
            exclusiveLicensed: false,
            totalLicenses: 0
        });
        emit TechnologyRegistered(technologyId, priceWei, isExclusive, tokenURI);
    }

    function updateTechnology(uint256 technologyId, string memory tokenURI, uint256 priceWei, bool isExclusive) external onlyOwner {
        TechnologyConfig storage cfg = _technologies[technologyId];
        require(cfg.isRegistered, "Not registered");
        cfg.tokenURI = tokenURI;
        cfg.priceWei = priceWei;
        cfg.isExclusive = isExclusive;
        emit TechnologyUpdated(technologyId, priceWei, isExclusive, tokenURI);
    }

    // Licenciamento: paga e recebe um NFT (uma licença). Se exclusiva, apenas uma licença é permitida
    function licenseTechnology(uint256 technologyId) external payable returns (uint256) {
        TechnologyConfig storage cfg = _technologies[technologyId];
        require(cfg.isRegistered, "Not registered");
        require(msg.value >= cfg.priceWei, "Insufficient payment");
        if (cfg.isExclusive) {
            require(!cfg.exclusiveLicensed, "Exclusive license sold");
            cfg.exclusiveLicensed = true;
        }

        // Mint NFT da licença
        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, cfg.tokenURI);
        cfg.totalLicenses += 1;

        // Forward payment to owner (AUIN)
        (bool ok, ) = payable(owner()).call{value: msg.value}("");
        require(ok, "Payment forward failed");

        emit Licensed(msg.sender, newTokenId, technologyId, msg.value);
        return newTokenId;
    }

    function getTechnology(uint256 technologyId) external view returns (
        string memory tokenURI,
        uint256 priceWei,
        bool isExclusive,
        bool isRegistered,
        bool exclusiveLicensed,
        uint256 totalLicenses
    ) {
        TechnologyConfig storage cfg = _technologies[technologyId];
        return (cfg.tokenURI, cfg.priceWei, cfg.isExclusive, cfg.isRegistered, cfg.exclusiveLicensed, cfg.totalLicenses);
    }

    // ======= Funções de Papéis =======
    function addResearcher(address account) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(!_researchers[account], "Already researcher");
        _researchers[account] = true;
        _researcherList.push(account);
        emit ResearcherAdded(account);
    }

    function removeResearcher(address account) external onlyOwner {
        require(_researchers[account], "Not a researcher");
        _researchers[account] = false;
        emit ResearcherRemoved(account);
    }

    function addCompany(address account) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(!_companies[account], "Already company");
        _companies[account] = true;
        _companyList.push(account);
        emit CompanyAdded(account);
    }

    function removeCompany(address account) external onlyOwner {
        require(_companies[account], "Not a company");
        _companies[account] = false;
        emit CompanyRemoved(account);
    }

    function isResearcher(address account) external view returns (bool) {
        return _researchers[account];
    }

    function isCompany(address account) external view returns (bool) {
        return _companies[account];
    }

    function getResearchers() external view returns (address[] memory) {
        return _researcherList;
    }

    function getCompanies() external view returns (address[] memory) {
        return _companyList;
    }
}


