// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./BoxBlockPaymentEth.sol";
import "hardhat/console.sol";

contract BoxBlockNFT is IERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _tokenBurnedCounter;

    uint256 private royaltyFee;
    address private royaltyRecipient;

    struct Artwork{
        address payable creator;
        uint8 royalty;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner,
        uint256 _royaltyFee,
        address _royaltyRecipient
    ) ERC721(_name, _symbol) {
        require(_royaltyFee <= 10000, "can't more than 10 percent");
        require(_royaltyRecipient != address(0), "The royalty recipient can't be 0 address");
        royaltyFee = _royaltyFee;
        royaltyRecipient = _royaltyRecipient;
        transferOwnership(_owner);
    }
    
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function safeMint(address to, string memory uri) public onlyOwner returns (uint){
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        setApprovalForAll(to, true);
        return tokenId;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        _tokenIdCounter.increment();
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getRoyaltyFee() external view returns (uint256) {
        return royaltyFee;
    }

    function getRoyaltyRecipient() external view returns(address) {
        return royaltyRecipient;
    }

    function updateRoyaltyFee(uint256 _royaltyFee) external onlyOwner {
        require(_royaltyFee <= 10000, "can't more than 10 percent");
        royaltyFee = _royaltyFee;
    }

    function calcTotalItems() external view returns (uint256) {
        uint256 totalItems = _tokenIdCounter.current();
        uint256 totalBurnedItems = _tokenBurnedCounter.current();
        return totalItems - totalBurnedItems;
    }

    function getMaxId() external view returns (uint256) {
        uint256 totalItems = _tokenIdCounter.current();
        return totalItems;
    }

    function transferToken(address from, address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == from, "From address must be token owner");
        _transfer(from, to, tokenId);
    }
}

contract BoxBlockNFTFactory {
    mapping(address => address[]) private nfts;

    mapping(address => bool) private boxblockNFT;

    event CreatedNFTCollection(
        address creator,
        address nft,
        string name,
        string symbol
    );

    function createNFTCollection(
        string memory _name,
        string memory _symbol,
        uint256 _royaltyFee,
        address _royaltyRecipient
    ) external {
        BoxBlockNFT nft = new BoxBlockNFT(
            _name,
            _symbol,
            msg.sender,
            _royaltyFee,
            _royaltyRecipient
        );
        nfts[msg.sender].push(address(nft));
        boxblockNFT[address(nft)] = true;
        emit CreatedNFTCollection(msg.sender, address(nft), _name, _symbol);
    }

    function getOwnCollections() external view returns (address[] memory) {
        return nfts[msg.sender];
    }

    function isBoxBlockNFT(address _nft) external view returns (bool) {
        return boxblockNFT[_nft];
    }

}

interface IBoxBlockNFTFactory {
    function createNFTCollection(
        string memory _name,
        string memory _symbol,
        uint256 _royaltyFee
    ) external;

    function isBoxBlockNFT(address _nft) external view returns (bool);
}

interface IBoxBlockNFT {
    function getRoyaltyFee() external view returns (uint256);

    function getRoyaltyRecipient() external view returns (address);

    function calcTotalItems() external view returns (uint256);

    function getMaxId() external view returns (uint256);

    function listTokens() external view returns (uint256);
}

contract BoxBlockNFTMarketplace is Ownable, ReentrancyGuard {
    IBoxBlockNFTFactory private immutable boxblockNFTFactory;
    using Counters for Counters.Counter;

    Counters.Counter private _marketItemCounter;
    Counters.Counter private _soldItemCounter;

    uint256 private platformFee;
    address private feeRecipient;

    struct ListNFT {
        address nft;
        uint256 tokenId;
        address seller;
        address payToken;
        uint256 price;
        bool sold;
    }

    struct OfferNFT {
        address nft;
        uint256 tokenId;
        address offerer;
        address payToken;
        uint256 offerPrice;
        bool accepted;
    }

    struct AuctionNFT {
        address nft;
        uint256 tokenId;
        address creator;
        address payToken;
        uint256 initialPrice;
        uint256 minBid;
        uint256 startTime;
        uint256 endTime;
        address lastBidder;
        uint256 heighestBid;
        address winner;
        bool success;
    }

    mapping(address => bool) public  payableToken;
    address[] private tokens;

    mapping(address => mapping(uint256 => ListNFT)) private listNfts;

    mapping(address => mapping(uint256 => mapping(address => OfferNFT)))
        private offerNfts;

    mapping(address => mapping(uint256 => AuctionNFT)) private auctionNfts;

    mapping(uint256 => mapping(uint256 => mapping(address => uint256)))
        private bidPrices;

    event ListedNFT(
        address indexed nft,
        uint256 indexed tokenId,
        address payToken,
        uint256 price,
        address indexed seller
    );
    event BoughtNFT(
        address indexed nft,
        uint256 indexed tokenId,
        address payToken,
        uint256 price,
        address seller,
        address indexed buyer
    );
    event OfferredNFT(
        address indexed nft,
        uint256 indexed tokenId,
        address payToken,
        uint256 offerPrice,
        address indexed offerer
    );
    event CanceledOfferredNFT(
        address indexed nft,
        uint256 indexed tokenId,
        address payToken,
        uint256 offerPrice,
        address indexed offerer
    );
    event AcceptedNFT(
        address indexed nft,
        uint256 indexed tokenId,
        address payToken,
        uint256 offerPrice,
        address offerer,
        address indexed nftOwner
    );
    event CreatedAuction(
        address indexed nft,
        uint256 indexed tokenId,
        address payToken,
        uint256 price,
        uint256 minBid,
        uint256 startTime,
        uint256 endTime,
        address indexed creator
    );
    event PlacedBid(
        address indexed nft,
        uint256 indexed tokenId,
        address payToken,
        uint256 bidPrice,
        address indexed bidder
    );
    event ResultedAuction(
        address indexed nft,
        uint256 indexed tokenId,
        address creator,
        address indexed winner,
        uint256 price,
        address caller
    );

    constructor(
        uint256 _platformFee,
        address _feeRecipient,
        IBoxBlockNFTFactory _boxblockNFTFactory
    ) {
        require(_platformFee <= 10000, "can't more than 10 percent");
        platformFee = _platformFee;
        feeRecipient = _feeRecipient;
        boxblockNFTFactory = _boxblockNFTFactory;
    }

    modifier isBoxBlockNFT(address _nft) {
        require(boxblockNFTFactory.isBoxBlockNFT(_nft), "not BoxBlock NFT");
        _;
    }

    modifier isListedNFT(address _nft, uint256 _tokenId) {
        ListNFT memory listedNFT = listNfts[_nft][_tokenId];
        require(
            listedNFT.seller != address(0) && !listedNFT.sold,
            "not listed"
        );
        _;
    }

    modifier isNotListedNFT(address _nft, uint256 _tokenId) {
        ListNFT memory listedNFT = listNfts[_nft][_tokenId];
        require(
            listedNFT.seller == address(0) || listedNFT.sold,
            "already listed"
        );
        _;
    }

    modifier isAuction(address _nft, uint256 _tokenId) {
        AuctionNFT memory auction = auctionNfts[_nft][_tokenId];
        require(
            auction.nft != address(0) && !auction.success,
            "auction already created"
        );
        _;
    }

    modifier isNotAuction(address _nft, uint256 _tokenId) {
        AuctionNFT memory auction = auctionNfts[_nft][_tokenId];
        require(
            auction.nft == address(0) || auction.success,
            "auction already created"
        );
        _;
    }

    modifier isOfferredNFT(
        address _nft,
        uint256 _tokenId,
        address _offerer
    ) {
        OfferNFT memory offer = offerNfts[_nft][_tokenId][_offerer];
        require(
            offer.offerPrice > 0 && offer.offerer != address(0),
            "not offerred nft"
        );
        _;
    }

    modifier isPayableToken(address _payToken) {
        require(
            _payToken != address(0) && payableToken[_payToken],
            "invalid pay token"
        );
        _;
    }

    function createSell(
        address _nft,
        uint256 _tokenId,
        address _payToken,
        uint256 _price
    ) external isBoxBlockNFT(_nft) isPayableToken(_payToken) {
        BoxBlockNFT nft = BoxBlockNFT(_nft);

        address tokenOwner = nft.ownerOf(_tokenId);

        require(tokenOwner == msg.sender, "not nft owner");

        nft.transferToken(tokenOwner, address(this), _tokenId);

        listNfts[_nft][_tokenId] = ListNFT({
            nft: _nft,
            tokenId: _tokenId,
            seller: msg.sender,
            payToken: _payToken,
            price: _price,
            sold: false
        });
        _marketItemCounter.increment();
        emit ListedNFT(_nft, _tokenId, _payToken, _price, msg.sender);
    }

    function cancelListedNFT(address _nft, uint256 _tokenId)
        external
        isListedNFT(_nft, _tokenId)
    {
        ListNFT memory listedNFT = listNfts[_nft][_tokenId];
        require(listedNFT.seller == msg.sender, "not listed owner");
        IERC721(_nft).transferFrom(address(this), msg.sender, _tokenId);
        delete listNfts[_nft][_tokenId];
        _marketItemCounter.decrement();
    }

    function buy(
        address _nft,
        uint256 _tokenId,
        address _payToken,
        uint256 _price
    ) external isListedNFT(_nft, _tokenId) payable {
        ListNFT storage listedNft = listNfts[_nft][_tokenId];
        BoxBlockPaymentEth payment_contract = BoxBlockPaymentEth(listedNft.payToken);

        require(
            _payToken != address(0) && _payToken == listedNft.payToken,
            "invalid pay token"
        );
        require(!listedNft.sold, "nft already sold");
        require(_price >= listedNft.price, "invalid price");
        require(msg.value >= listedNft.price, "invalid price");

        listedNft.sold = true;

        uint256 totalPrice = _price;
        uint256 price = _price;
        IBoxBlockNFT nft = IBoxBlockNFT(listedNft.nft);
        address royaltyRecipient = nft.getRoyaltyRecipient();
        uint256 royaltyFee = nft.getRoyaltyFee();

        if (royaltyFee > 0) {
            uint256 royaltyTotal = calculateRoyalty(royaltyFee, _price);

            // Transfer royalty fee to collection owner
            payment_contract.payEnvolveds{value: royaltyTotal}(royaltyRecipient);
            totalPrice -= royaltyTotal;
        }

        // Calculate & Transfer platfrom fee
        uint256 platformFeeTotal = calculatePlatformFee(_price);

        //transfer platform fee
        payment_contract.payEnvolveds{value: platformFeeTotal}(feeRecipient);

        //transfer to nft owner
        payment_contract.payEnvolveds{value: totalPrice - platformFeeTotal}(listedNft.seller);


        // Transfer NFT to buyer
        IERC721(listedNft.nft).safeTransferFrom(
            address(this),
            msg.sender,
            listedNft.tokenId
        );

        _marketItemCounter.decrement();
        _soldItemCounter.increment();

        emit BoughtNFT(
            listedNft.nft,
            listedNft.tokenId,
            listedNft.payToken,
            price,
            listedNft.seller,
            msg.sender
        );
    }
    
    // @notice Offer listed NFT
    function makeOffer(
        address _nft,
        uint256 _tokenId,
        address _payToken,
        uint256 _offerPrice
    ) external isListedNFT(_nft, _tokenId) {
        require(_offerPrice > 0, "price can not 0");

        ListNFT memory nft = listNfts[_nft][_tokenId];
        IERC20(nft.payToken).transferFrom(
            msg.sender,
            address(this),
            _offerPrice
        );

        offerNfts[_nft][_tokenId][msg.sender] = OfferNFT({
            nft: nft.nft,
            tokenId: nft.tokenId,
            offerer: msg.sender,
            payToken: _payToken,
            offerPrice: _offerPrice,
            accepted: false
        });

        emit OfferredNFT(
            nft.nft,
            nft.tokenId,
            nft.payToken,
            _offerPrice,
            msg.sender
        );
    }

    function cancelOffer(address _nft, uint256 _tokenId)
        external
        isOfferredNFT(_nft, _tokenId, msg.sender)
    {
        OfferNFT memory offer = offerNfts[_nft][_tokenId][msg.sender];
        require(offer.offerer == msg.sender, "not offerer");
        require(!offer.accepted, "offer already accepted");
        delete offerNfts[_nft][_tokenId][msg.sender];
        IERC20(offer.payToken).transfer(offer.offerer, offer.offerPrice);
        emit CanceledOfferredNFT(
            offer.nft,
            offer.tokenId,
            offer.payToken,
            offer.offerPrice,
            msg.sender
        );
    }

    function acceptOfferNFT(
        address _nft,
        uint256 _tokenId,
        address _offerer
    )
        external
        isOfferredNFT(_nft, _tokenId, _offerer)
        isListedNFT(_nft, _tokenId)
    {
        require(
            listNfts[_nft][_tokenId].seller == msg.sender,
            "not listed owner"
        );
        OfferNFT storage offer = offerNfts[_nft][_tokenId][_offerer];
        ListNFT storage list = listNfts[offer.nft][offer.tokenId];
        require(!list.sold, "already sold");
        require(!offer.accepted, "offer already accepted");

        list.sold = true;
        offer.accepted = true;

        uint256 offerPrice = offer.offerPrice;
        uint256 totalPrice = offerPrice;

        IBoxBlockNFT nft = IBoxBlockNFT(offer.nft);
        address royaltyRecipient = nft.getRoyaltyRecipient();
        uint256 royaltyFee = nft.getRoyaltyFee();

        IERC20 payToken = IERC20(offer.payToken);

        if (royaltyFee > 0) {
            uint256 royaltyTotal = calculateRoyalty(royaltyFee, offerPrice);

            payToken.transfer(royaltyRecipient, royaltyTotal);
            totalPrice -= royaltyTotal;
        }

        uint256 platformFeeTotal = calculatePlatformFee(offerPrice);
        payToken.transfer(feeRecipient, platformFeeTotal);

        payToken.transfer(list.seller, totalPrice - platformFeeTotal);

        IERC721(list.nft).safeTransferFrom(
            address(this),
            offer.offerer,
            list.tokenId
        );

        emit AcceptedNFT(
            offer.nft,
            offer.tokenId,
            offer.payToken,
            offer.offerPrice,
            offer.offerer,
            list.seller
        );
    }

    function createAuction(
        address _nft,
        uint256 _tokenId,
        address _payToken,
        uint256 _price,
        uint256 _minBid,
        uint256 _startTime,
        uint256 _endTime
    ) external isPayableToken(_payToken) isNotAuction(_nft, _tokenId) {
        BoxBlockNFT nft = BoxBlockNFT(_nft);
        require(nft.ownerOf(_tokenId) == msg.sender, "not nft owner");
        require(_endTime > _startTime, "invalid end time");

        nft.transferToken(msg.sender, address(this), _tokenId);

        auctionNfts[_nft][_tokenId] = AuctionNFT({
            nft: _nft,
            tokenId: _tokenId,
            creator: msg.sender,
            payToken: _payToken,
            initialPrice: _price,
            minBid: _minBid,
            startTime: _startTime,
            endTime: _endTime,
            lastBidder: address(0),
            heighestBid: _price,
            winner: address(0),
            success: false
        });

        _marketItemCounter.increment();

        emit CreatedAuction(
            _nft,
            _tokenId,
            _payToken,
            _price,
            _minBid,
            _startTime,
            _endTime,
            msg.sender
        );
    }

    function cancelAuction(address _nft, uint256 _tokenId)
        external
        isAuction(_nft, _tokenId)
    {
        AuctionNFT memory auction = auctionNfts[_nft][_tokenId];
        require(auction.creator == msg.sender, "not auction creator");
        require(block.timestamp < auction.startTime, "auction already started");
        require(auction.lastBidder == address(0), "already have bidder");

        IERC721 nft = IERC721(_nft);
        nft.transferFrom(address(this), msg.sender, _tokenId);
        delete auctionNfts[_nft][_tokenId];

        _marketItemCounter.decrement();
    }

    function placeBid(
        address _nft,
        uint256 _tokenId,
        uint256 _bidPrice
    ) external isAuction(_nft, _tokenId) {
        require(
            block.timestamp >= auctionNfts[_nft][_tokenId].startTime,
            "auction not start"
        );
        require(
            block.timestamp <= auctionNfts[_nft][_tokenId].endTime,
            "auction ended"
        );
        require(
            _bidPrice >=
                auctionNfts[_nft][_tokenId].heighestBid +
                    auctionNfts[_nft][_tokenId].minBid,
            "less than min bid price"
        );

        AuctionNFT storage auction = auctionNfts[_nft][_tokenId];
        IERC20 payToken = IERC20(auction.payToken);
        payToken.transferFrom(msg.sender, address(this), _bidPrice);

        if (auction.lastBidder != address(0)) {
            address lastBidder = auction.lastBidder;
            uint256 lastBidPrice = auction.heighestBid;

            payToken.transfer(lastBidder, lastBidPrice);
        }
    
        auction.lastBidder = msg.sender;
        auction.heighestBid = _bidPrice;

        emit PlacedBid(_nft, _tokenId, auction.payToken, _bidPrice, msg.sender);
    }

    function completeBid(address _nft, uint256 _tokenId) external {
        require(!auctionNfts[_nft][_tokenId].success, "already resulted");
        require(
            msg.sender == owner() ||
                msg.sender == auctionNfts[_nft][_tokenId].creator ||
                msg.sender == auctionNfts[_nft][_tokenId].lastBidder,
            "not creator, winner, or owner"
        );
        require(
            block.timestamp > auctionNfts[_nft][_tokenId].endTime,
            "auction not ended"
        );

        AuctionNFT storage auction = auctionNfts[_nft][_tokenId];
        IERC20 payToken = IERC20(auction.payToken);
        IERC721 nft = IERC721(auction.nft);

        auction.success = true;
        auction.winner = auction.creator;

        IBoxBlockNFT BoxBlockNft = IBoxBlockNFT(_nft);
        address royaltyRecipient = BoxBlockNft.getRoyaltyRecipient();
        uint256 royaltyFee = BoxBlockNft.getRoyaltyFee();

        uint256 heighestBid = auction.heighestBid;
        uint256 totalPrice = heighestBid;

        if (royaltyFee > 0) {
            uint256 royaltyTotal = calculateRoyalty(royaltyFee, heighestBid);

            payToken.transfer(royaltyRecipient, royaltyTotal);
            totalPrice -= royaltyTotal;
        }

        uint256 platformFeeTotal = calculatePlatformFee(heighestBid);
        payToken.transfer(feeRecipient, platformFeeTotal);

        payToken.transfer(auction.creator, totalPrice - platformFeeTotal);

        nft.transferFrom(address(this), auction.lastBidder, auction.tokenId);

        _marketItemCounter.decrement();
        _soldItemCounter.increment();

        emit ResultedAuction(
            _nft,
            _tokenId,
            auction.creator,
            auction.lastBidder,
            auction.heighestBid,
            msg.sender
        );
    }

    function calculatePlatformFee(uint256 _price)
        public
        view
        returns (uint256)
    {
        return (_price * platformFee) / 10000;
    }

    function calculateRoyalty(uint256 _royalty, uint256 _price)
        public
        pure
        returns (uint256)
    {
        return (_price * _royalty) / 10000;
    }

    function getListedNFT(address _nft, uint256 _tokenId)
        public
        view
        returns (ListNFT memory)
    {
        return listNfts[_nft][_tokenId];
    }

    function getAuctionedNFT(address _nft, uint256 _tokenId)
        public
        view
        returns (AuctionNFT memory)
    {
        return auctionNfts[_nft][_tokenId];
    }

    function checkListedNft(address _nft, uint256 _tokenId) public view returns (bool) {
        ListNFT memory listedNFT = listNfts[_nft][_tokenId];
        return  listedNFT.seller != address(0) && !listedNFT.sold;
    }

    function checkAuctionNft(address _nft, uint256 _tokenId) public view returns (bool) {
        AuctionNFT memory auction = auctionNfts[_nft][_tokenId];
        return  auction.nft != address(0) && !auction.success;
    }

    function getListedNFTs(address _nft) public view returns (ListNFT[] memory) {

        uint totalIndexes = 0;
        uint currentIndex = 0;

        IBoxBlockNFT nft = IBoxBlockNFT(_nft);
        uint256 maxId = nft.getMaxId();
        //IERC721 nft_ierc = IERC721(_nft);

        for (uint i = 0; i < maxId; i++) {
            if ( checkListedNft(_nft, i) ) {
                totalIndexes += 1;
            }
        }

        ListNFT[] memory items = new ListNFT[](totalIndexes);

        for (uint i = 0; i < maxId; i++) {
            
            if ( checkListedNft(_nft, i) ) {
                items[currentIndex] = listNfts[_nft][i];
                currentIndex += 1;
            }
        }

        return items;
    }

    function getAuctionedNFTs(address _nft) public view returns (AuctionNFT[] memory) {

        uint totalIndexes = 0;
        uint currentIndex = 0;

        IBoxBlockNFT nft = IBoxBlockNFT(_nft);
        uint256 maxId = nft.getMaxId();
        //IERC721 nft_ierc = IERC721(_nft);

        for (uint i = 0; i < maxId; i++) {
            if ( checkAuctionNft(_nft, i) ) {
                totalIndexes += 1;
            }
        }

        AuctionNFT[] memory items = new AuctionNFT[](totalIndexes);

        for (uint i = 0; i < maxId; i++) {
            
            if ( checkAuctionNft(_nft, i) ) {
                items[currentIndex] = auctionNfts[_nft][i];
                currentIndex += 1;
            }
        }

        return items;
    }

    function getPayableTokens() external view returns (address[] memory) {
        return tokens;
    }

    function checkIsPayableToken(address _payableToken)
        external
        view
        returns (bool)
    {
        return payableToken[_payableToken];
    }

    function addPayableToken(address _token) external onlyOwner {
        require(_token != address(0), "invalid token");
        require(!payableToken[_token], "already payable token");
        payableToken[_token] = true;
        tokens.push(_token);
    }

    function updatePlatformFee(uint256 _platformFee) external onlyOwner {
        require(_platformFee <= 10000, "can't more than 10 percent");
        platformFee = _platformFee;
    }

    function changeFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "can't be 0 address");
        feeRecipient = _feeRecipient;
    }
}