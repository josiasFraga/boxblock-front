import { useEffect, useState } from "react";
import { Modal, Radio, Label, TextInput, Checkbox } from "flowbite-react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Router from 'next/router'
import toast, { Toaster } from 'react-hot-toast'
import { client } from '../lib/sanityClient.js'
import winPoints from '../assets/images/win_points.png'
import Image from 'next/image'

import { BsFacebook } from 'react-icons/bs'
import { FaTiktok, FaTwitter, FaInstagram } from 'react-icons/fa'

import { validatePhone } from "validations-br";
import { pt } from 'yup-locale-pt';
yup.setLocale(pt);

const ModalChangeUserInfo = ({ show, setShow, changing, user }) => {
    const maskPhone = value => {
        return value
          .replace(/\D/g, "")
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d{4})(\d)/, "$1-$2");
    };

    let title = "";
    let subtitle = "";
    let confirm_text = "Confirmar";

  const [initialValues, setInitialValues] = useState(
    {
        userName: "",
        email: "",
        instagram: "",
        phone: "",
        facebook: "",
        tiktok: "",
        twitter: "",
        senha: "",
        senha_repeat: "",
        receivePromotionEmail: "N",
        receivePromotionPhone: "N",
    }
  )

  const [step, setStep] = useState(0)
  const [wizardSocialMedia, setWizardSocialMedia] = useState("instagram")

  let validation = {};

  const validateFormName = {
    userName: yup
        .string()
        .required("Digite seu nome")
    };

  const validateFormEmail = {
    email: yup
        .string()
        .email("Digite um email válido")
        .required("Digite seu email")
    };

  const validateFormPhone = {
    phone: yup
        .string()
        .trim()
        .required("Digite seu telefone")
        /*
        .test(
            "is-phone",
            "Digite um Telefone válido",
            (value) => validatePhone(value)
        )*/
    }

  if ( changing == "name" ) {
    validation = yup.object().shape(
        validateFormName
    )
  }

  if ( changing == "email" ) {
    validation = yup.object().shape(validateFormEmail);
  }

  if ( changing == "instagram" ) {
    validation = yup.object().shape({
        instagram: yup
            .string()
            .required("Digite ou cole o link do seu instagram")
    });
  }

  if ( changing == "tiktok" ) {
    validation = yup.object().shape({
        tiktok: yup
            .string()
            .required("Digite ou cole o link do seu tiktok")
    });
  }

  if ( changing == "twitter" ) {
    validation = yup.object().shape({
        twitter: yup
            .string()
            .required("Digite ou cole o link do seu twitter")
    });
  }

  if ( changing == "phone" ) {
    validation = yup.object().shape(validateFormPhone)
  }

  if ( changing == "facebook" ) {
    validation = yup.object().shape({
        facebook: yup
          .string()
          .required("Digite ou cole o link do seu facebook")
    });
  }

  if ( changing == "password" ) {

    title = "Que tal proteger sua conta?";
    subtitle = "Sua coleção precisa de proteção.";

    if ( step == 0 ) {

        validation = yup.object().shape({
            senha: yup
              .string()
              .required("Digite uma senha válida")
        });
    }
    else if ( step == 1 ) {
        title = "Quase lá...";

        validation = yup.object().shape({
            senha_repeat: yup.string().required("Digite uma senha válida")
            .oneOf([yup.ref('senha'), null], 'As senhas devem ser idênticas!')
        });
    }
  }

  if ( changing == "wizard" ) {

    if ( step == 0 ){ 
        validation = yup.object().shape(
            validateFormName
        )
        confirm_text = "Próximo"
        title = "Queremos muito te conhecer";
    }

    if ( step == 1 ){ 
        validation = yup.object().shape({})
        confirm_text = "Próximo"
        title = " ";
    }

    if ( step == 2 ){ 
        validation = yup.object().shape(
            validateFormEmail
        )
        confirm_text = "Próximo"
        title = "Queremos muito te conhecer";
    }

    if ( step == 3 ){ 
        validation = yup.object().shape(
            validateFormPhone
        )
        confirm_text = "Próximo"
        title = "Queremos muito te conhecer";
    }

    if ( step == 4 ){ 
        validation = yup.object().shape({})
        confirm_text = "Finalizar"
        title = "Queremos muito te conhecer";
    }

  }
    
  const changeProfileInfo = async (values, sanityClient = client) => {
    let result = "";
    if ( changing == "name" || (changing == "wizard" && step == 0) ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"userName": values.userName }) // Shallow merge
        .commit();

        if ( changing == "wizard" ) {
    
            let new_saldo = 50;
            if ( user.saldo != null ) {
                new_saldo = parseFloat(user.saldo) + 50;
            }
        
            result = await sanityClient.patch(user._id) // Document ID to patch
            .set({"saldo":  new_saldo}) // Shallow merge
            .commit();
        }
        console.log("nome do usuário atualizado");

    }
    else if ( changing == "email" || (changing == "wizard" && step == 2) ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"email": values.email, receivePromotionEmail: values.receivePromotionEmail }) // Shallow merge
        .commit();
        console.log("email do usuário atualizado");

    }
    else if ( changing == "instagram" ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"igHandle": values.instagram }) // Shallow merge
        .commit();
        console.log("instagram do usuário atualizado");

    }
    else if ( changing == "facebook" ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"fbHandle": values.facebook }) // Shallow merge
        .commit();
        console.log("facebook do usuário atualizado");

    }
    else if ( changing == "twitter" ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"twitterHandle": values.twitter }) // Shallow merge
        .commit();
        console.log("twitter do usuário atualizado");

    }
    else if ( changing == "tiktok" ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"tiktokHandle": values.tiktok }) // Shallow merge
        .commit();
        console.log("Tiktok do usuário atualizado");

    }
    else if ( changing == "phone" || (changing == "wizard" && step == 3) ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"phoneHandle": values.phone, "receivePromotionPhone" : values.receivePromotionPhone }) // Shallow merge
        .commit();
        console.log("telefone do usuário atualizado");

    }
    else if ( changing == "password" ) {

        if ( step == 0 ) {
            setStep(1);
            return "changing_password";
        }
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"senha": values.senha }) // Shallow merge
        .commit();
        console.log("Senha do usuário atualizada");
        setStep(0);

    }
    else if ( changing == "wizard" && step == 4 ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"fbHandle": values.facebook, "tiktokHandle" : values.tiktok, "igHandle" : values.instagram, "twitterHandle" : values.twitter }) // Shallow merge
        .commit();
        console.log("redes sociais do usuário atualizadas");

    }
    
    if ( changing == "wizard" ) {

        if ( step == 4 ) {
            setStep(0)
            return "wizard_end";
        }

        setStep(step+1);
        return "wizard";

    }
    
    return result;
  }


  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values, {setSubmitting, resetForm}) => {
    
        setSubmitting(true);
        const toastId = toast.loading(`Estamos atualizando suas informações, aguarde...`);

        const update_db = await changeProfileInfo(values);
        if ( update_db == "changing_password" || update_db == "wizard" ) {
            toast.dismiss(toastId);
            return false;
        }
    
    
        resetForm();
        setSubmitting(false);
        setShow(false);
        Router.reload(window.location.pathname)
        toast.dismiss(toastId);
        toast.success(`Informações de perfil atualizadas com sucesso`);
    },
    validationSchema: validation
  });

  return (
    <>
        <BlockUi tag="div" blocking={formik.isSubmitting}>
            <Modal show={show} size="md" popup={true} onClose={() => { setShow(false) }}>
                <Modal.Body>
                <div className=" px-6 pb-4 sm:pb-6 lg:px-0 xl:pb-8 pt-8">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb pb-0">
                    {title == "" ? "Atualizar Dados Pessoas" : title}
                    </h3>
                    <h4 className="text-gray-400 dark:text-white mt-0 pt-0">
                    {subtitle}
                    </h4>
                </div>
                {
                    changing == "name" && 
                    <div className="mb-4 block">
                        <Label htmlFor="userName" value="Nome" />
                        <TextInput 
                            name="userName" 
                            id="userName" 
                            placeholder="Digite seu nome completo"
                            value={formik.values.userName}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.userName && formik.touched.userName && <label className="invalid-feedback text-xs">{formik.errors.userName}</label>}
                    </div>
                }
                {
                    changing == "email" && 
                    <div className="mb-4 block">
                        <Label htmlFor="email" value="Email" />
                        <TextInput 
                            name="email" 
                            id="email" 
                            placeholder="Digite seu email"
                            value={formik.values.email}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.email && formik.touched.email && <label className="invalid-feedback text-xs">{formik.errors.email}</label>}

                        <div className="flex items-center gap-2 mt-4">
                            <Checkbox 
                                id="receivePromotionEmail"
                                defaultChecked={formik.values.receivePromotionEmail == "N"}
                                onChange={(evt)=>{
                                    formik.setFieldValue("receivePromotionEmail", (evt.target.checked ? "N" : "Y") );
                                }}
                            />
                            <Label htmlFor="receivePromotionEmail">
                                Não quero receber promoções do Gurumê
                            </Label>
                        </div>
                    </div>
                }
                {
                    changing == "instagram" && 
                    <div className="mb-4 block">
                        <Label htmlFor="instagram" value="Link do Instagram" />
                        <TextInput 
                            name="instagram" 
                            id="instagram" 
                            placeholder="Digite o link do seu instagram"
                            value={formik.values.instagram}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.instagram && formik.touched.instagram && <label className="invalid-feedback text-xs">{formik.errors.instagram}</label>}
                    </div>
                }
                {
                    changing == "facebook" && 
                    <div className="mb-4 block">
                        <Label htmlFor="facebook" value="Link do Facebook" />
                        <TextInput 
                            name="facebook" 
                            id="facebook" 
                            placeholder="Digite o link do seu facebook"
                            value={formik.values.facebook}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.facebook && formik.touched.facebook && <label className="invalid-feedback text-xs">{formik.errors.facebook}</label>}
                    </div>
                }
                {
                    changing == "twitter" && 
                    <div className="mb-4 block">
                        <Label htmlFor="twitter" value="Link do Twitter" />
                        <TextInput 
                            name="twitter" 
                            id="twitter" 
                            placeholder="Digite o link do seu twitter"
                            value={formik.values.twitter}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.twitter && formik.touched.twitter && <label className="invalid-feedback text-xs">{formik.errors.twitter}</label>}
                    </div>
                }
                {
                    changing == "tiktok" && 
                    <div className="mb-4 block">
                        <Label htmlFor="tiktok" value="Link do Tiktok" />
                        <TextInput 
                            name="tiktok" 
                            id="tiktok" 
                            placeholder="Digite o link do seu tiktok"
                            value={formik.values.tiktok}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.tiktok && formik.touched.tiktok && <label className="invalid-feedback text-xs">{formik.errors.tiktok}</label>}
                    </div>
                }
                {
                    changing == "phone" && 
                    <div className="mb-4 block">
                        <Label htmlFor="phone" value="Digite Seu Telefone" />
                        <TextInput 
                            name="phone" 
                            id="phone" 
                            placeholder="(XX) XXXXX-XXXX"
                            maxLength={15}
                            minLength={15}
                            value={formik.values.phone}
                            onChange={(ev) => {

                                console.log(ev.target.value);
                                if ( ev.target.value == null ) {
                                    formik.setFieldValue("phone", "");
                                } else {
                                    formik.setFieldValue("phone", maskPhone(ev.target.value));
                                }
                                formik.setTouched("phone", true);
                                //formik.handleChange
                            }} 
                        />

                        {formik.errors.phone && formik.touched.phone && <label className="invalid-feedback text-xs">{formik.errors.phone}</label>}

                        <div className="flex items-center gap-2 mt-4">
                            <Checkbox 
                                id="receivePromotionPhone"
                                defaultChecked={formik.values.receivePromotionPhone == "N"}
                                onChange={(evt)=>{
                                    formik.setFieldValue("receivePromotionPhone", (evt.target.checked ? "N" : "Y") );
                                }}
                            />
                            <Label htmlFor="receivePromotionPhone">
                                Não quero receber promoções do Gurumê
                            </Label>
                        </div>
                    </div>
                }
                {
                    changing == "password" && step == 0 && 
                    <div className="mb-4 block">
                        <Label htmlFor="senha" value="Senha" />
                        <TextInput 
                            name="senha" 
                            id="senha" 
                            type="password"
                            placeholder="Digite uma senha"
                            value={formik.values.senha}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.senha && formik.touched.senha && <label className="invalid-feedback text-xs">{formik.errors.senha}</label>}
                    </div>
                }
                {
                    changing == "password" && step == 1 && 
                    <div className="mb-4 block">
                        <Label htmlFor="senha" value="Repita a Senha" />
                        <TextInput 
                            name="senha_repeat" 
                            id="senha_repeat" 
                            type="password"
                            placeholder="Repita a senha"
                            value={formik.values.senha_repeat}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.senha_repeat && formik.touched.senha_repeat && <label className="invalid-feedback text-xs">{formik.errors.senha_repeat}</label>}
                    </div>
                }

                {
                    changing == "wizard" && step == 0 && 
                    <div className="mb-4 block">
                        <Label htmlFor="userName" value="Qual seu nome?" />
                        <TextInput 
                            name="userName" 
                            id="userName" 
                            placeholder="Digite seu nome"
                            value={formik.values.userName}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.userName && formik.touched.userName && <label className="invalid-feedback text-xs">{formik.errors.userName}</label>}
                    </div>
                }

                {
                    changing == "wizard" && step == 1 && 
                    <div className="mb-4 block text-center">    
                        <Image src={winPoints} height={210} width={150} />
                        <h4>Você ganhou +50 pontos!</h4>
                    </div>
                }

                {
                    changing == "wizard" && step == 2 && 
                    <div className="mb-4 block">
                        <Label htmlFor="userName" value="Qual seu email?" />

                        <TextInput 
                            name="email" 
                            id="email" 
                            placeholder="Digite seu email"
                            value={formik.values.email}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.email && formik.touched.email && <label className="invalid-feedback text-xs">{formik.errors.email}</label>}

                        <div className="flex items-center gap-2 mt-4">
                            <Checkbox 
                                id="receivePromotionEmail"
                                defaultChecked={formik.values.receivePromotionEmail == "N"}
                                onChange={(evt)=>{
                                    formik.setFieldValue("receivePromotionEmail", (evt.target.checked ? "N" : "Y") );
                                }}
                            />
                            <Label htmlFor="receivePromotionEmail">
                                Não quero receber promoções do Gurumê
                            </Label>
                        </div>
                    </div>
                }

                {
                    changing == "wizard" && step == 3 &&

                    <div className="mb-4 block">
                        <Label htmlFor="phone" value="Digite Seu Telefone" />
                        <TextInput 
                            name="phone" 
                            id="phone" 
                            placeholder="(XX) XXXXX-XXXX"
                            maxLength={15}
                            minLength={15}
                            value={formik.values.phone}
                            onChange={(ev) => {

                                console.log(ev.target.value);
                                if ( ev.target.value == null ) {
                                    formik.setFieldValue("phone", "");
                                } else {
                                    formik.setFieldValue("phone", maskPhone(ev.target.value));
                                }
                                formik.setTouched("phone", true);
                                //formik.handleChange
                            }} 
                        />

                        {formik.errors.phone && formik.touched.phone && <label className="invalid-feedback text-xs">{formik.errors.phone}</label>}

                        <div className="flex items-center gap-2 mt-4">
                            <Checkbox 
                                id="receivePromotionPhone"
                                defaultChecked={formik.values.receivePromotionPhone == "N"}
                                onChange={(evt)=>{
                                    formik.setFieldValue("receivePromotionPhone", (evt.target.checked ? "N" : "Y") );
                                }}
                            />
                            <Label htmlFor="receivePromotionPhone">
                                Não quero receber promoções do Gurumê
                            </Label>
                        </div>
                    </div>
                }

                {
                    changing == "wizard" && step == 4 &&

                    <div className="mb-4 block">
                        <Label htmlFor={wizardSocialMedia} value="Qual seu usuario das redes sociais?" />
                        {
                            wizardSocialMedia == "instagram" &&
                            <TextInput 
                                name={"instagram"} 
                                id={"instagram"} 
                                placeholder=""
                                value={formik.values.instagram}
                                onChange={(ev) => {
    
                                    if ( ev.target.value == null ) {
                                        formik.setFieldValue("instagram", "");
                                    } else {
                                        formik.setFieldValue("instagram", ev.target.value);
                                    }
                                    formik.setTouched("instagram", true);
                                    //formik.handleChange
                                }} 
                            />
                        }
                        {
                            wizardSocialMedia == "tiktok" &&
                            <TextInput 
                                name={"tiktok"} 
                                id={"tiktok"} 
                                placeholder=""
                                value={formik.values.tiktok}
                                onChange={(ev) => {
    
                                    if ( ev.target.value == null ) {
                                        formik.setFieldValue("tiktok", "");
                                    } else {
                                        formik.setFieldValue("tiktok", ev.target.value);
                                    }
                                    formik.setTouched("tiktok", true);
                                    //formik.handleChange
                                }} 
                            />
                        }
                        {
                            wizardSocialMedia == "twitter" &&
                            <TextInput 
                                name={"twitter"} 
                                id={"twitter"} 
                                placeholder=""
                                value={formik.values.twitter}
                                onChange={(ev) => {
    
                                    if ( ev.target.value == null ) {
                                        formik.setFieldValue("twitter", "");
                                    } else {
                                        formik.setFieldValue("twitter", ev.target.value);
                                    }
                                    formik.setTouched("twitter", true);
                                    //formik.handleChange
                                }} 
                            />
                        }
                        {
                            wizardSocialMedia == "facebook" &&
                            <TextInput 
                                name={"facebook"} 
                                id={"facebook"} 
                                placeholder=""
                                value={formik.values.facebook}
                                onChange={(ev) => {
    
                                    if ( ev.target.value == null ) {
                                        formik.setFieldValue("facebook", "");
                                    } else {
                                        formik.setFieldValue("facebook", ev.target.value);
                                    }
                                    formik.setTouched("facebook", true);
                                    //formik.handleChange
                                }} 
                            />
                        }

                        {formik.errors["instagram"] && formik.touched["instagram"] && <label className="invalid-feedback text-xs">{formik.errors["instagram"]}</label>}

                        <div className="flex flex-row">
                            <div className="flex flex-1 items-center gap-2 mt-4">
                                <Radio 
                                    id={"radio_instagram"}
                                    value={"instagram"}
                                    checked={wizardSocialMedia == "instagram"}
                                    onChange={()=>{
                                        setWizardSocialMedia("instagram");
                                    }}
                                />
                                <FaInstagram style={{backgroundColor: "#000", color: "#FFF", padding: 5, borderRadius: "100%", fontSize: 10}}  size={25} />
                                <Label htmlFor="radio_instagram">
                                    Instagram
                                </Label>
                            </div>
                            <div className="flex flex-1 items-center gap-2 mt-4">
                                <Radio 
                                    id={"radio_tiktok"}
                                    value={"tiktok"}
                                    checked={wizardSocialMedia == "tiktok"}
                                    onChange={()=>{
                                        setWizardSocialMedia("tiktok");
                                    }}
                                />
                                <FaTiktok style={{backgroundColor: "#000", color: "#FFF", padding: 5, borderRadius: "100%", fontSize: 10}}  size={25} />
                                <Label htmlFor="radio_tiktok">
                                  Tiktok
                                </Label>
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <div className="flex flex-1 items-center gap-2 mt-4">
                                <Radio 
                                    id={"radio_twitter"}
                                    value={"instagram"}
                                    checked={wizardSocialMedia == "twitter"}
                                    onChange={()=>{
                                        setWizardSocialMedia("twitter");
                                    }}
                                />
                                <FaTwitter style={{backgroundColor: "#000", color: "#FFF", padding: 5, borderRadius: "100%", fontSize: 10}}  size={25} />
                                <Label htmlFor="radio_twitter">
                                    Twitter
                                </Label>
                            </div>
                            <div className="flex flex-1 items-center gap-2 mt-4">
                                <Radio 
                                    id={"radio_facebook"}
                                    value={"facebook"}
                                    checked={wizardSocialMedia == "facebook"}
                                    onChange={()=>{
                                        setWizardSocialMedia("facebook");
                                    }}
                                />
                                <BsFacebook color="#000" size={25} />
                                <Label htmlFor="radio_facebook">
                                  Facebook
                                </Label>
                            </div>
                        </div>

                    </div>
                }

                <div className="w-full flex flex-col">

                    <div className="w-full pt-4 flex flex-1">
        
                        <button 
                            className="bg-blue-700 w-full hover:bg-blue-900 disabled:bg-gray-500 disabled:border-gray-500 text-white font-bold py-2 px-4 border border-blue-700 rounded flex-row flex items-center justify-center flex-1"
                            onClick={formik.handleSubmit} 
                            disabled={formik.isSubmitting}>{confirm_text}</button>
                    </div>

                    { changing == "password" && step > 0 &&
                    <div className="w-full flex flex-1 pt-4">
                        <button 
                            className="bg-white w-full hover:bg-blue-100 disabled:bg-gray-500 disabled:border-gray-500 text-blue-700 font-bold py-2 px-4 border border-blue-700 rounded flex-row flex items-center justify-center flex-1"
                            onClick={()=>{setStep(step-1)}} 
                            disabled={formik.isSubmitting}>Voltar</button>
                    </div>

                    }

                    { changing == "wizard" && step > 1 && step != 4 &&
                    <div className="w-full flex flex-1 pt-4">
                        <button 
                            className="bg-white w-full hover:bg-blue-100 disabled:bg-gray-500 disabled:border-gray-500 text-blue-700 font-bold py-2 px-4 border border-blue-700 rounded flex-row flex items-center justify-center flex-1"
                            onClick={()=>{setStep(step-1)}} 
                            disabled={formik.isSubmitting}>Voltar</button>
                    </div>

                    }
                    <div className="w-full flex flex-1 pt-4">
                        <a
                            onClick={()=>{
                                setStep(0);
                                setShow(false)
                            }}
                            className="text-blue-700 hover:underline dark:text-blue-500 cursor-pointer pt-2 pb-2 w-full text-center"
                            >
                            Fechar
                        </a>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </BlockUi>
    </>
  );
};

export default ModalChangeUserInfo;