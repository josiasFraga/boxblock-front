import { useEffect, useState } from 'react'
import { MdMailOutline } from 'react-icons/md'
import { MdOutlineCall } from 'react-icons/md'
import { CgInstagram } from 'react-icons/cg'
import { AiOutlineFacebook } from 'react-icons/ai'
import { AiOutlineUser } from 'react-icons/ai'

import ModalChangeUserIfno from '../../../components/ModalChangeUserInfo';

const InfoProfile = (props) => {

    const user = props.user;
    const [showNodal, setShowModal] = useState(false);
    const [changing, setChanging] = useState("");

    const openModal = (param) => {
        setChanging(param);
        setShowModal(true);
    }

    console.log(user);

    return (
        <div className="px-2 mt-8">

            <ModalChangeUserIfno setShow={setShowModal} changing={changing} show={showNodal} user={user} />

            <div className="container flex flex-wrap justify-between items-center mx-auto mb-8">
                <div className="flex flex-col">
                    <div className="flex flex-row py-2 cursor-pointer" onClick={() => openModal("name")}>
                        <div className="flex justify-center items-center mr-2 text-xl">
                            <AiOutlineUser />
                        </div>
                        <div>{user?.userName == "Sem Nome" ? "Informar Nome" : user?.userName}</div>
                    </div>
                    <div className="flex flex-row py-2 cursor-pointer" onClick={() => openModal("email")}>
                        <div className="flex justify-center items-center mr-2 text-xl">
                            <MdMailOutline />
                        </div>
                        <div>{user?.email == null ? "Informar Email" : user?.email}</div>
                    </div>
                    <div className="flex flex-row py-2 cursor-pointer" onClick={() => openModal("instagram")}>
                        <div className="flex justify-center items-center mr-2 text-xl">
                            <CgInstagram />
                        </div>
                        <div>{user?.igHandle == null ? "Informar Instagram" : user?.igHandle}</div>
                    </div>
                    <div className="flex flex-row py-2 cursor-pointer" onClick={() => openModal("phone")}>
                        <div className="flex justify-center items-center mr-2 text-xl">
                            <MdOutlineCall />
                        </div>
                        <div>{user?.phoneHandle == null ? "Informar Telefone" : user?.phoneHandle}</div>
                    </div>
                    <div className="flex flex-row py-2 cursor-pointer" onClick={() => openModal("facebook")}>
                        <div className="flex justify-center items-center mr-2 text-xl">
                            <AiOutlineFacebook />
                        </div>
                        <div>{user?.igHandle == null ? "Informar Facebook" : user?.fbHandle}</div>
                    </div>
                </div>
            </div>
 
        </div>
    )
}

export default InfoProfile