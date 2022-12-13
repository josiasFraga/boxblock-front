import { useEffect, useState } from "react";
import { Modal, Spinner } from "flowbite-react";
import Image from 'next/image'
import secureImg from '../../assets/images/secure.png'
import { client } from '../../lib/sanityClient.js'
import toast, { Toaster } from 'react-hot-toast'

const ModalMintNft = ({ show, setShow, cpf, setNftToShow }) => {

    function randomNumberBetween(min, max) {  
        return Math.floor(
          Math.random() * (max - min) + min
        )
      }

    const fetchUserBalances = async (sanityClient = client) => {
      const query = `*[_type == "users" && _id == "${cpf}"] {
        saldo,
        saldoUsado,
      }`;
  
      const userInfo = await sanityClient.fetch(query)
      return userInfo[0];
    }

    const chageUserBalance = async (user_balance, user_balance_used, sanityClient = client) => {

        const new_balance = parseInt(user_balance) - 300;
        const new_balance_used = parseInt(user_balance_used == null ? 0 : user_balance_used) + 300;

        console.log("atualizando os saldos do usuário");

        const result = await sanityClient.patch(cpf) // Document ID to patch
        .set({
            "saldo": new_balance,
            "saldoUsado": new_balance_used,
        }) // Shallow merge
        .commit();
        console.log("saldos do usuário atualizados");

        return result;
    }

    const getNft = async (sanityClient = client) => {

        const query = `*[_type == "marketTokens" && internalOwner == null] {_id}`;
        const nftsInfo = await sanityClient.fetch(query);

        if ( nftsInfo.length == 0 ) {
            toast.error("Não restam mais NFTs livres")
            setShow(false);
            return false;
        }

        console.log("atualizando o internal holder do token");
        const choosedNft = nftsInfo[randomNumberBetween(0, (nftsInfo.length-1))];
        const result = await sanityClient.patch(choosedNft["_id"]) // Document ID to patch
        .set({
        "internalOwner": {
            _type: 'reference',
            _ref: cpf
        },
        }) // Shallow merge
        .commit();
        setNftToShow(choosedNft["_id"]);
        console.log("internal holder atualizado");
        return result;
    }

    const internalMintNft = async () => {
        if ( show ) {
            const user_balances = await fetchUserBalances();
            if ( parseInt(user_balances.saldo) >= 300 ) {
                const change_user_balances = await chageUserBalance(user_balances.saldo, user_balances.saldoUsado);
                const get_nft = await getNft();
                toast.success("Nft minerado com sucesso!")
                setShow(false);
                return false;
            } else {
                toast.error("Saldo Insificiente.")
                setShow(false);
                return false;
            }
        }
    }

    useEffect(function() {
        internalMintNft();
    },[show]);

  return (
        <Modal show={show} size="md" popup={true} onClose={() => { setShow(false) }}>
            <Modal.Header />
            <Modal.Body>
            <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-0 xl:pb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center font-sora">
                Cunhando seu NFT
                </h3>
            </div>

            <div className="flex justify-center">
            <Image src={secureImg} height={191} width={285} />

            </div>

            <h4 className="text-lg text-gray-900 dark:text-white text-center font-sora mt-4">
                Mintando seu NFT
            </h4>
        
            <p className="text-center mb-4">Estará disponível na sua carteira</p>

            <div className="w-full flex">
                <div className="w-full">
                    <button className="bg-primary w-full hover:bg-primary-dark disabled:bg-gray-500 disabled:border-gray-500 text-white font-bold py-4 px-4 border border-primary rounded flex-row flex items-center justify-center" onClick={()=>{}} disabled={false}>
                        <div className="mr-3">
                            <Spinner
                                size="sm"
                                light={true}
                            />
                        </div>
                        Processando
                    </button>
                </div>
            </div>
            </Modal.Body>
        </Modal>
  );
};

export default ModalMintNft;