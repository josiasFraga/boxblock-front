import React, {useRef} from 'react';
import Image from 'next/image'
import { useS3Upload } from 'next-s3-upload';

import { client } from '../../../lib/sanityClient.js'
import noProfilePhoto from '../../../assets/images/no_profile_photo.png'
import Router from 'next/router'
import toast, { Toaster } from 'react-hot-toast'

const ImageProfile = (props) => {
    let { uploadToS3 } = useS3Upload();
    const inputFile = useRef(null);
    const user = props.user;


    const updateProfileImage = async (image_url, sanityClient = client) => {
    
        const result = await sanityClient.patch(user?._id) // Document ID to patch
        .set({"profileImage": image_url }) // Shallow merge
        .commit();
        console.log("imagem do usuário atualizada");
    
        return result;
      }
    
    const changeProfileImage = async (evt) => {
        const toastId = toast.loading(`Mudando sua foto de perfil`);
        let image_url = await uploadImage(evt.target.files[0]);
        await updateProfileImage(image_url);
        Router.reload(window.location.pathname)
        toast.dismiss(toastId);
        toast.success(`Foto de perfil alterada com sucesso`);
    }

    const uploadImage = async(image) => {
      console.log("uploading image");
      let { url } = await uploadToS3(image);
      url = url.replace("boxblock-collections.boxblock-collections", "boxblock-collections")
      console.log("image uploaded");
      return url;
    }

    return (
        <div>
            <div className="w-full h-32 bg-blue-700 mb-12">
                <Toaster position="top-right" reverseOrder={false} />
                <div className='relative w-full h-full'>
                    <div className='absolute ' style={{marginLeft: "-50px", left: "50%", bottom: "-50px"}} onClick={()=>{
                        inputFile.current.click();
                    }}>
                        <Image src={user && user.profileImage && user.profileImage != null && user.profileImage != "" ? user.profileImage : noProfilePhoto} height={100} width={100} className="rounded-full cursor-pointer" />
                        <input type="file" name="photo" id="photo" className='hidden' ref={inputFile} onChange={changeProfileImage} accept="image/png, image/jpeg" />
                    </div>
                </div>
            </div>

            <h3 className="text-center font-sora">{user?.userName}</h3>
        </div>
    )
}

export default ImageProfile