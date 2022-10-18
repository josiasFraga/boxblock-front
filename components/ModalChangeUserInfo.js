import { useEffect, useState } from "react";
import { Modal, Button, Label, TextInput, Checkbox } from "flowbite-react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Router from 'next/router'
import toast, { Toaster } from 'react-hot-toast'
import { client } from '../lib/sanityClient.js'

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

  const [initialValues, setInitialValues] = useState(
    {
        userName: "",
        email: "",
        instagram: "",
        phone: "",
        facebook: "",
    }
  )

  let validation = {};

  if ( changing == "name" ) {
    validation = yup.object().shape({
        userName: yup
            .string()
            .required("Digite seu nome")
    });
  }

  if ( changing == "email" ) {
    validation = yup.object().shape({
        email: yup
            .string()
            .email("Digite um email válido")
            .required("Digite seu email")
        });
  }

  if ( changing == "instagram" ) {
    validation = yup.object().shape({
        instagram: yup
            .string()
            .required("Digite ou cole o link do seu instagram")
    });
  }

  if ( changing == "phone" ) {
    validation = yup.object().shape({
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
    })
  }

  if ( changing == "facebook" ) {
    validation = yup.object().shape({
        facebook: yup
          .string()
          .required("Digite ou cole o link do seu facebook")
    });
  }
    
  const changeProfileInfo = async (values, sanityClient = client) => {
    let result = "";
    if ( changing == "name" ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"userName": values.userName }) // Shallow merge
        .commit();
        console.log("nome do usuário atualizado");

    }
    else if ( changing == "email" ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"email": values.email }) // Shallow merge
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
    else if ( changing == "phone" ) {
    
        result = await sanityClient.patch(user._id) // Document ID to patch
        .set({"phoneHandle": values.phone }) // Shallow merge
        .commit();
        console.log("telefone do usuário atualizado");

    }
    
    return result;
  }


  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values, {setSubmitting, resetForm}) => {
        setSubmitting(true);
        const toastId = toast.loading(`Estamos atualizando suas informações, aguarde...`);
        console.log(values);
        await changeProfileInfo(values);
        resetForm();
        setSubmitting(false);
        setShow(false);
        Router.reload(window.location.pathname)
        toast.dismiss(toastId);
        toast.success(`Informações de perfil atualizadas com sucesso`);
    },
    validationSchema: validation
  });

  console.log(formik.errors);
  return (
    <>
        <BlockUi tag="div" blocking={formik.isSubmitting}>
            <Toaster position="top-right" reverseOrder={false} />
            <Modal show={show} size="md" popup={true} onClose={() => { setShow(false) }}>
                <Modal.Header />
                <Modal.Body>
                <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-0 xl:pb-8">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Atualizar Dados Pessoas
                    </h3>
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
                    </div>
                }

                <div className="w-full flex flex-row">
                    <div className="col flex-1 flex items-center">
                        <a
                        onClick={()=>{setShow(false)}}
                        className="text-blue-700 hover:underline dark:text-blue-500 cursor-pointer"
                        >
                        Cancelar
                        </a>
                    </div>
                    <div className="col">
                        <Button className={"w-full"} onClick={formik.handleSubmit} disabled={formik.isSubmitting}>Confirmar</Button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </BlockUi>
    </>
  );
};

export default ModalChangeUserInfo;