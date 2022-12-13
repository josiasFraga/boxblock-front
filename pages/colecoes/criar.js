import { useEffect, useState } from 'react'
import {DropzoneArea} from 'material-ui-dropzone'

import Header from '../../components/Header.js'
import FormCollection from '../../components/Pages/Colecoes/Criar/FromCollection.js'
import ImageRadio from '../../components/ImageRadio'
import { client } from '../../lib/sanityClient.js'
import { Photo } from '@material-ui/icons';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import { TextField } from '@material-ui/core/';
import { ethers } from 'ethers'
import Web3Modal from "web3modal";
import { useS3Upload } from 'next-s3-upload';
import { useWeb3 } from '@3rdweb/hooks'

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import {
  marketplaceAddress,
  factoryAddress,
  paymentAddress
} from '../../config'

import BoxBlockNFT from '../../artifacts/contracts/BoxBlock.sol/BoxBlockNFT.json'
import BoxBlockNFTFactory from '../../artifacts/contracts/BoxBlock.sol/BoxBlockNFTFactory.json'
import BoxBlockNFTMarketplace from '../../artifacts/contracts/BoxBlock.sol/BoxBlockNFTMarketplace.json'

import toast from 'react-hot-toast';
import { style } from '../../components/Styles/Colecoes/styles.js'

const providerOptions = {
};

const Criar = (props) => {

  const { address } = useWeb3();
  const router = useRouter();
  let { uploadToS3 } = useS3Upload();
  const [myCollections, setMyCollections] = useState([])

  /*const [initialValues, setInitialValues] = useState(
    {
      itemName: '',
      fixed_price: true,
      put_to_sell: true,
      use_existing_collection: false,
      itemPrice: null,
      files: [],
	  collectionAddress: null,
      collectionName: "",
      collectionSymbol: "",
      collectionTag: "",
      collectionDescripttion: "",
      collectionPhoto: null,
      collectionCover: null,
	  minimumBid: null
    }
  )*/

  const [initialValues, setInitialValues] = useState(
    {
      itemName: 'macaco',
      fixed_price: true,
      put_to_sell: true,
      use_existing_collection: false,
      itemPrice: "0.002",
      files: [],
	  collectionAddress: null,
      collectionName: "Coleção de Macacos",
      collectionSymbol: "CDM",
      collectionTag: "Animais",
      collectionDescripttion: "Descrição dos Macacos",
      collectionPhoto: null,
      collectionCover: null,
	  minimumBid: null,
    }
  )

  const validation = yup.object().shape({
    files: yup.array()
    	.required('Você deve adicionar pelo menos um arquivo') // these constraints are shown if and only if inner constraints are satisfied
    	.min(1, 'Você deve adicionar pelo menos um arquivo'),
    itemName: yup.string().required('O campo nome é obrigatório.'),
    itemPrice: yup
      .number("Digite uma valor válido")
      .required("Digite o valor do item"),
	minimumBid: yup
      .number()
      .nullable()
      .when("fixed_price", {
        is: false,
        then: yup.number("Digite um valor válido").required("Digite o valor do lance mínimo")
      }),
    collectionAddress: yup
      .mixed()
      .when("use_existing_collection", {
        is: true,
        then: yup.mixed().required("Selecione uma coleção")
    }),
    collectionName: yup
        .string()
        .when("use_existing_collection", {
          is: false,
          then: yup.string().required("Digite o nome da coleção")
      }),
    collectionSymbol: yup
        .string()
        .when("use_existing_collection", {
          is: false,
          then: yup.string().required("Digite o símbolo da coleção")
      }),
    collectionTag: yup
        .string()
        .when("use_existing_collection", {
          is: false,
          then: yup.string().required("Digite a tag da coleção")
      }),
    collectionPhoto: yup
      .mixed()
      .when("use_existing_collection", {
        is: false,
        then: yup.mixed().required("Selecione a imagem da coleção")
    }),
    collectionCover: yup
      .mixed()
      .when("use_existing_collection", {
        is: false,
        then: yup.mixed().required("Selecione a imagem de capa da coleção")
    })
  })

  const mintNft = async(contractAddress, url) => {

    console.log("Minerando NFT");

    const web3Modal = new Web3Modal({
      network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
  
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    let nftContract = new ethers.Contract(contractAddress, BoxBlockNFT.abi, signer);

    try {
      let mint = await nftContract.safeMint(marketplaceAddress, url);
      await mint.wait(); //wait complete transation

      console.log(mint);

      console.log("NFT minerado");
      return true;

    } catch (e) {
      console.log("erro ao minerar NFT");
      return e;
    }

  }

  const loadCollections = async() => {

    const web3Modal = new Web3Modal({
      //network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
  
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    let factoryContract = new ethers.Contract(factoryAddress, BoxBlockNFTFactory.abi, signer);
    let userCollections = await factoryContract.getOwnCollections();

    console.log("Carregando coleções");

    const query = `*[_type == "marketItems" && _id in $ids] {
      _id,
      profileImage,
      title,
      floorPrice
    }`

    const collectionData = await client.fetch(query, {ids: userCollections});
    setMyCollections(collectionData);

  }

  const getLastNftIndex = async(collection_address) => {
    console.log("Buscando último index da coleção: " + collection_address);

    const web3Modal = new Web3Modal({
    	network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);

    let contract = new ethers.Contract(collection_address, BoxBlockNFT.abi, provider);
    
    try{
      let maxIndex = await contract.getMaxId();
      return maxIndex.toNumber();

    } catch (e)  {
      console.log(e);
      return "error"
    }

  }

  const create_collection = async({collectionName, collectionSymbol}) => {
    console.log("Criando coleção: " + collectionName);

    const web3Modal = new Web3Modal({
      network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    let factoryContract = new ethers.Contract(factoryAddress, BoxBlockNFTFactory.abi, signer);
    let n_cllections = 0;
    let collectionAddress = "";

    try{
      let userCollections = await factoryContract.getOwnCollections()
      n_cllections = userCollections.length;

      const create_collection = await factoryContract.createNFTCollection(collectionName, collectionSymbol, 0, address);
      await create_collection.wait(); //wait complete transation

      userCollections = await factoryContract.getOwnCollections();
  
      const last_collection_index = (parseInt(userCollections.length) - 1);
      collectionAddress = userCollections[last_collection_index];

      console.log("Coleção Criada");
      return collectionAddress;

    } catch (e)  {
      console.log(e);
      return "error"
    }

  }

  const uploadImage = async(image) => {
    console.log("uploading image");
    let { url } = await uploadToS3(image);
    url = url.replace("boxblock-collections.boxblock-collections", "boxblock-collections")
    console.log("image uploaded");
    return url;
  }

  const saveCollection = async({collectionName, collectionSymbol, collectionTag, collectionDescripttion, itemName}, contractAddress, collectionProfilePhoto, collectionProfileCover, walletAddressId) => {
    console.log("salvando coleção");
  
    const marketItemDoc = {
      _type: 'marketItems',
      _id: contractAddress,
      title: collectionName,
      tag: collectionTag,
	    tokenName: itemName,
      symbol: collectionSymbol,
      contractAddress: contractAddress,
      description: collectionDescripttion,
      createdBy: {
        _type: 'reference',
        _ref: walletAddressId
      },
      volumeTraded: 0,
      floorPrice: 0,
      /*owners:[{
          _type: 'reference',
          _ref: walletAddressId
      }],*/
      profileImage: collectionProfilePhoto,
      bannerImage: collectionProfileCover,
    }

    console.log(marketItemDoc);

    const result = await client.createIfNotExists(marketItemDoc);

    console.log("coleção salva");

    return result;
  }

  const saveToken = async( contractAddress, tokenId, tokenUrl, walletAddressId, onMarketplace, type, price ) => {
    console.log("salvando token");
  
    const marketTokenDoc = {
      _type: 'marketTokens',
      contractAddress: contractAddress,
      tokenId: tokenId,
      url: tokenUrl,
      sold: "N",
      onMarketplace: onMarketplace,
      type: type,
      price: parseFloat(price),
      createdBy: {
        _type: 'reference',
        _ref: walletAddressId
      },
      owner: {
        _type: 'reference',
        _ref: walletAddressId
      },
    }

    const result = await client.create(marketTokenDoc);
    console.log("token salvo");

    return result;
  }

  const putToSell = async (collectionId, nftId, preco) => {
    const nftPrice = ethers.utils.parseUnits(preco, 'ether');

    console.log("Colocando NFT a Venda");

    const web3Modal = new Web3Modal({
      network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
  
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    let market = new ethers.Contract(marketplaceAddress, BoxBlockNFTMarketplace.abi, signer);
    const createSell = await market.createSell(collectionId,nftId,paymentAddress,nftPrice);

    await createSell.wait(); //wait complete transation


    console.log("NFT colocando a venda");

	return true;

  }

  const putToAuction = async (collectionId, nftId, preco, minBid) => {
    const nftPrice = ethers.utils.parseUnits(preco, 'ether');
    const nftMinBid = ethers.utils.parseUnits(minBid, 'ether');

    console.log("Colocando NFT a Leilão [start]");

    const web3Modal = new Web3Modal({
      network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
  
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    let today = new Date();
    let end_auction = new Date();
    end_auction.setDate(today.getDate()+14)

    let market = new ethers.Contract(marketplaceAddress, BoxBlockNFTMarketplace.abi, signer);
    const createAuction = await market.createAuction(collectionId, nftId, paymentAddress,nftPrice, nftMinBid, today.getTime(), end_auction.getTime());

    await createAuction.wait(); //wait complete transation

    console.log("NFT colocando a Leilão [end]");
	
	return true;
  }

  const onChnageDropZone = (files_dropzone) => {
    formik.setFieldValue('files',files_dropzone)
  }

  const updateContractFloorPrice = async (contractAddress, floor_price) => {

    console.log("atualizando valor mais baixo do contrato");

    const result = await client.patch(contractAddress) // Document ID to patch
    .set({"floorPrice": parseFloat(floor_price)}) // Shallow merge
    .commit();
    console.log("contrato atualizado");

    return result;
  }

  const formik = useFormik({
	enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: async (values, {setSubmitting, resetForm}) => {

		let collection_address = "";
    let collection_floor_price = 0;

		if ( formik.values.use_existing_collection ) {

			collection_address = formik.values.collectionAddress;
      const collection_selected = myCollections.filter((collection)=>{
        return collection._id == collection_address;
      })
      
      collection_floor_price = collection_selected[0]['floorPrice'];

		} else {
		
			const newCollectionAddress = await create_collection(values);
			
			if ( newCollectionAddress == "error" ) {
				toast.error("Ocorreu um erro ao tentar gerar a coleção!");
				setSubmitting(false);
				return false;
			}

			//upload collection images
			let collectionProfilePhoto = await uploadImage(values.collectionPhoto);
			let collectionProfileCover = await uploadImage(values.collectionCover);

			await saveCollection(values, newCollectionAddress, collectionProfilePhoto, collectionProfileCover, address);

			collection_address = newCollectionAddress;

		}

		let lastNftIndex = 0;
	  lastNftIndex = await getLastNftIndex(collection_address);

		const fixed_price = values.fixed_price;
		const put_to_sell = values.put_to_sell;
    let uploaded_images = [];

		await Promise.all(formik.values.files.map(async (file, index) => {
			uploaded_images[index] = await uploadImage(file);
			await mintNft(collection_address, uploaded_images[index]);
      let nftId = lastNftIndex+index;
      if ( !put_to_sell ) {
        await saveToken( collection_address, nftId, uploaded_images[index], address, "N", "", 0);
      }
			return true;
		}));
	
		if ( put_to_sell ) {
			await Promise.all(values.files.map(async (file, index) => {

				let nftId = lastNftIndex+index;

				if ( fixed_price ) {
					await putToSell(collection_address, nftId, values.itemPrice);
				}
				else {
					await putToAuction(collection_address, nftId, values.itemPrice, values.minimumBid);
				}

        let nft_market_type = "";

        if ( put_to_sell && fixed_price ) {
          nft_market_type = "list";
        }

        if ( put_to_sell && !fixed_price ) {
          nft_market_type = "auction";
        }

        await saveToken( collection_address, nftId, uploaded_images[index], address, "Y", nft_market_type, values.itemPrice);
  
				return true;
			}));
		}

		router.push({
			pathname: `/colecao/${collection_address}`,
		});

		toast("Coleção criada com sucesso!");
		setSubmitting(false);
		resetForm();
    },
    validationSchema: validation
  });

  useEffect(() => {
    if ( formik.values.use_existing_collection ){
      loadCollections()
    }
  }, [formik.values.use_existing_collection])

  return (
    <div className="overflow-hidden">

      <BlockUi tag="div" blocking={formik.isSubmitting}>
      <Header />

      {
        !address && 
        <div className={style.walletConnectWrapper}>
          <button
            className={style.button}
            onClick={async () => {
              const web3Modal = new Web3Modal()
              await web3Modal.connect()
            }}
          >
            Conecte-se para integragir
          </button>
          <div className={style.details}>
            Você precisa do plguin da metamask para acessar
          </div>
        </div>
      }

      {address &&
        <div className="flex justify-center">
          <div className="w-1/2 flex flex-col pb-12">
              <DropzoneArea
                  onChange={onChnageDropZone}
                  acceptedFiles={['image/*']}
                  dropzoneText={"Arraste ou abra um arquivo"}
                  Icon={Photo}
                  filesLimit={15}
                  dropzoneClass={"mt-8"}
                  maxFileSize={104857600}
                  getFileRemovedMessage={(rejectedFile) => { return `O arquivo ${rejectedFile} foi removido.`}}
                  getFileLimitExceedMessage={(filesLimit) => { return `O número máximo de arquivos foi atingido. Somente ${filesLimit} são permitidos`}}
                  getFileAddedMessage={(fileName) => { return `O arquivo ${fileName} foi adicionado com sucesso.`}}
              />
              {formik.errors.files && formik.touched.files && <label className="invalid-feedback">{formik.errors.files}</label>}

              <div className='w-full mt-3 font-medium'>
                Informações
              </div>

              <div className='w-full mt-2'>
                <TextField
                  name="itemName"
                  error={formik.errors.itemName && formik.touched.itemName}
                  id="itemName"
                  label="Nome do Item"
                  defaultValue={formik.values.itemName}
                  onChange={formik.handleChange}
                  helperText={formik.errors.itemName}
                  fullWidth
                  variant="outlined"
                  className={"bg-white"}
                />
              </div>

              <div className="flex items-center mb-2 mt-4">
                <div className='flex-row flex'>
                  <div className='flex justify-center flex-col'>
                    <input 
                      id="checkbox-put-to-sell" 
                      type="checkbox" 
                      checked={formik.values.put_to_sell} 
                      onChange={(evt) => {
                        formik.setFieldValue("put_to_sell", evt.target.checked);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div className='flex flex-col'>
                  <label 
                    for="checkbox-put-to-sell" 
                    className="ml-2 font-medium text-gray-600 dark:text-gray-300">
                      Disponibilizar Item para Venda
                  </label>
                  <p className='ml-2 text-sm text-gray-400'>Você vai receber ofertas pelo item</p>
                </div>
              </div>

              <div className="flex items-center mb-4 mt-4">
                <div className='flex-row flex'>
                  <div className='flex justify-center flex-col'>
                    <input 
                      id="checkbox-fixed-price" 
                      type="checkbox" 
                      checked={formik.values.fixed_price} 
                      onChange={(evt) => {
                        formik.setFieldValue("fixed_price", evt.target.checked);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    </div>

                    <div className='flex flex-col'>
                      <label 
                        for="checkbox-fixed-price" 
                        className="ml-2 font-medium text-gray-600 dark:text-gray-300">
                          Preço Fixo
                      </label>
                      <p className='ml-2 text-sm text-gray-400'>Informar o preço fixo que será disponibilizado para venda</p>
                    </div>
                  </div>
              </div>
  
              <div className='w-full mt-2'>
                <TextField
                  name="itemPrice"
                  error={formik.errors.itemPrice && formik.touched.itemPrice}
                  id="itemPrice"
                  label="Preço (em ETH)"
                  defaultValue={formik.values.itemPrice}
                  onChange={formik.handleChange}
                  helperText={formik.errors.itemPrice}
                  fullWidth
                  variant="outlined"
                  className={"bg-white"}
                />
              </div>

              {!formik.values.fixed_price && 
              <div className='w-full mt-2'>
                <TextField
                  name="minimumBid"
                  error={formik.errors.minimumBid && formik.touched.minimumBid}
                  id="minimumBid"
                  label="Lance mínimo (em ETH)"
                  defaultValue={formik.values.minimumBid}
                  onChange={formik.handleChange}
                  helperText={formik.errors.minimumBid}
                  fullWidth
                  variant="outlined"
                  className={"bg-white"}
                />
              </div>
              }

              <div className="flex items-center mb-2 mt-4">
                <div className='flex-row flex'>
                  <div className='flex justify-center flex-col'>
                    <input 
                      id="checkbox-use-existing-collection" 
                      type="checkbox" 
                      checked={formik.values.use_existing_collection} 
                      onChange={(evt) => {
                        formik.setFieldValue("use_existing_collection", evt.target.checked);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label 
                      for="checkbox-fixed-price" 
                      className="ml-2 font-medium text-gray-600 dark:text-gray-300">
                        Usar Coleção Existente
                    </label>
                    <p className='ml-2 text-sm text-gray-400'>Escolha uma coleção existente ou crie uma nova</p>
                  </div>
                </div>
              </div>
              { formik.values.use_existing_collection && 
              <div className='w-full mt-2 flex flex-row overflow-x-scroll'>
                {myCollections.map((collection) => 
                  <ImageRadio 
                    formik={formik} 
                    profileImage={collection.profileImage}
                    title={collection.title} 
                    contractAddress={collection._id}
                  />
                )}
              </div>
              }

              {!formik.values.use_existing_collection && 
              <>
              <FormCollection formik={formik} />
                {formik.errors.collectionAddress && formik.touched.collectionAddress && <label className="invalid-feedback">{formik.errors.collectionAddress}</label>}
              </>
              }

              <button onClick={formik.handleSubmit} disabled={formik.isSubmitting} className="font-bold mt-4 bg-primary hover:bg-primary-dark text-white rounded p-4 shadow-lg">
                Enviar
              </button>
          </div>
        </div>
      }
      </BlockUi>
  
    </div>
  )
}

export default Criar
