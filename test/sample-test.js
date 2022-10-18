/* test/sample-test.js */
const fs = require("fs")
const path = require("path")
const dir = path.resolve(
  __dirname,
  "../artifacts/contracts/BoxBlock.sol/BoxBlockNFT.json"
)
const file = fs.readFileSync(dir, "utf8")
const json = JSON.parse(file)
const BoxBlockNFT = json;



describe("MarketPlace", function() {
  it("Não passou no teste", async function() {

    const platformFee = 1000; //(10000 = 10%)
    const nftPrice = ethers.utils.parseUnits('0.4', 'ether');
    const martkeplaceSupply = ethers.utils.parseUnits('0.5', 'ether');
    const [_, sellerAddress, sellerAddress2, buyerAddress] = await ethers.getSigners()
    const [deployer] = await ethers.getSigners()

    /* deploy the bloxblockfactory */
    const BoxBlockNFTFactory = await hre.ethers.getContractFactory("BoxBlockNFTFactory");
    const boxBlockNFTFactory = await BoxBlockNFTFactory.deploy();
    await boxBlockNFTFactory.deployed();

    /* deploy the marketplace */
    const BoxBlockNFTMarketplace = await hre.ethers.getContractFactory("BoxBlockNFTMarketplace");
    const boxblockMarketplace = await BoxBlockNFTMarketplace.deploy(platformFee, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", boxBlockNFTFactory.address);
    await boxblockMarketplace.deployed();

    /* deploy the payment token */
    const BoxBlockPaymentEth = await hre.ethers.getContractFactory("BoxBlockPaymentEth");
    const boxBlockPaymentEth = await BoxBlockPaymentEth.deploy();
    await boxBlockPaymentEth.deployed();
    
    console.log("boxBlockNFTFactory deployed to:", boxBlockNFTFactory.address);
    console.log("boxblockMarketplace deployed to:", boxblockMarketplace.address);
    console.log("boxBlockPaymentEth deployed to:", boxBlockPaymentEth.address);

    //connect to payment address and tranfer ethers to
    /*let paymentConnection = await boxBlockPaymentEth.connect(deployer);
    await paymentConnection.allowance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", boxblockMarketplace.address);
    const approve = await paymentConnection.approve(boxblockMarketplace.address, martkeplaceSupply);
    await approve.wait();
    const approve2 = await paymentConnection.approve("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", martkeplaceSupply);
    await approve2.wait();
    await paymentConnection.transferFrom("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", boxblockMarketplace.address, martkeplaceSupply);*/

    //seller 1 --------------------------------------------------------
    await boxblockMarketplace.addPayableToken(boxBlockPaymentEth.address);

    let sellerConnectionMarketplace = await boxblockMarketplace.connect(sellerAddress);
    let sellerConnectionFactory = await boxBlockNFTFactory.connect(sellerAddress);

    await sellerConnectionFactory.createNFTCollection("Coleção 1", "TSTNM", 0, sellerAddress.address);
    const seller_collections = await sellerConnectionFactory.getOwnCollections();

    // deploy nft
    let mintNftContract = new ethers.Contract(seller_collections[0], BoxBlockNFT.abi, sellerAddress);
    await mintNftContract.connect(sellerAddress).safeMint(boxblockMarketplace.address, "https://google.com.br");
    await mintNftContract.connect(sellerAddress).safeMint(boxblockMarketplace.address, "https://googled.com.br");
    await mintNftContract.connect(sellerAddress).safeMint(boxblockMarketplace.address, "https://googlesdsd.com.br");
    await mintNftContract.connect(sellerAddress).safeMint(boxblockMarketplace.address, "https://googledsfsdsd.com.br");
    await mintNftContract.connect(sellerAddress).safeMint(boxblockMarketplace.address, "https://googlffesdsd.com.br");

    //put to sell
    await sellerConnectionMarketplace.createSell(seller_collections[0],0,boxBlockPaymentEth.address,nftPrice);
    await sellerConnectionMarketplace.createSell(seller_collections[0],3,boxBlockPaymentEth.address,nftPrice);

    let listedItems = await sellerConnectionMarketplace.getListedNFTs(seller_collections[0]);


    //buy action
    let buyerConnectionMarketplace = await boxblockMarketplace.connect(buyerAddress);
    console.log("criando compra");
    const buyItem = await buyerConnectionMarketplace.buy(seller_collections[0],0,boxBlockPaymentEth.address,nftPrice, {value: nftPrice});


    console.log("criando venda");
    const putToSellItem = await buyerConnectionMarketplace.createSell(seller_collections[0],0,boxBlockPaymentEth.address,nftPrice);
    console.log(putToSellItem);

    //listedItems = await sellerConnectionMarketplace.getListedNFTs(seller_collections[0]);
    //console.log(listedItems);

    //console.log(listedItems);


    //seller 2 --------------------------------------------------------
    /*await boxblockMarketplace.addPayableToken(sellerAddress2.address);

    let sellerConnectionMarketplace2 = await boxblockMarketplace.connect(sellerAddress2);
    let sellerConnectionFactory2 = await boxBlockNFTFactory.connect(sellerAddress2);

    await sellerConnectionFactory2.createNFTCollection("Coleção 1", "TSTNM", 0, sellerAddress2.address);
    const seller_collections2 = await sellerConnectionFactory2.getOwnCollections();

    // deploy nft
    let mintNftContract2 = new ethers.Contract(seller_collections2[0], BoxBlockNFT.abi, sellerAddress2);
    await mintNftContract2.connect(sellerAddress2).safeMint(boxblockMarketplace.address, "https://google.com.br");
    await mintNftContract2.connect(sellerAddress2).safeMint(boxblockMarketplace.address, "https://googled.com.br");
    await mintNftContract2.connect(sellerAddress2).safeMint(boxblockMarketplace.address, "https://googlesdsd.com.br");
    await mintNftContract2.connect(sellerAddress2).safeMint(boxblockMarketplace.address, "https://googledsfsdsd.com.br");
    await mintNftContract2.connect(sellerAddress2).safeMint(boxblockMarketplace.address, "https://googlffesdsd.com.br");

    //put to sell
    await sellerConnectionMarketplace2.createSell(seller_collections2[0],0,sellerAddress2.address,nftPrice);
    await sellerConnectionMarketplace2.createSell(seller_collections2[0],3,sellerAddress2.address,nftPrice);

    //put to auction
    let today = new Date();
    let end_auction = new Date();
    end_auction.setDate(today.getDate()+7)
    await sellerConnectionMarketplace2.createAuction(seller_collections2[0],1,sellerAddress2.address,nftPrice,nftPrice,Date.now(), end_auction.getTime());
    await sellerConnectionMarketplace2.createAuction(seller_collections2[0],4,sellerAddress2.address,nftPrice,nftPrice,Date.now(), end_auction.getTime());

    const listedItems2 = await sellerConnectionMarketplace2.getListedNFTs(seller_collections2[0]);
    const auctionItems = await sellerConnectionMarketplace2.getAuctionedNFTs(seller_collections2[0]);
    console.log(listedItems2);
    console.log(auctionItems);*/

  })
})
