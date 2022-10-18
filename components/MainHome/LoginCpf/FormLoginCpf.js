import { MdArrowDropDown } from 'react-icons/md'
import { maskCpf } from '../../Masks'
import { useFormik } from 'formik';
import Router from 'next/router'
import { client } from '../../../lib/sanityClient.js'

import * as yup from 'yup';
import { validateCPF } from "validations-br";
import { pt } from 'yup-locale-pt';
yup.setLocale(pt);

const FormLoginCpf = () => {

    const initialValues = {cpf: ""}

    const validation = yup.object().shape({
        cpf: yup.string().required("Digite um CPF válido").test(
            "is-cpf",
            "Digite um CPF válido",
            (value) => validateCPF(value)
        )
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        onSubmit: async (values, {setSubmitting, resetForm}) => {

            setSubmitting(true);

            const userDoc = {
                _type: 'users',
                _id: values.cpf,
                userName: 'Sem Nome',
                walletAddress: "",
            }
        
            const result = await client.createIfNotExists(userDoc)
            
            window.localStorage.setItem("us_cpf", values.cpf)

            setSubmitting(false);
            
            resetForm();
            Router.reload(window.location.pathname)
        },
        validationSchema: validation
    });

    function handleChangeMask(event) {

        const { value } = event.target;
        formik.setFieldValue("cpf", maskCpf(value));
    }

    return (
        <>

            <h1 className="font-extrabold text-xl pr-16 tracking-tight leading-none text-gray-900 md:text-2xl xl:text-3xl dark:text-white font-sora flex flex-row mb-4">CPF <MdArrowDropDown /></h1>

            <input 
                type="tel" 
                id="cpf" 
                className="block px-4 py-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="000.000.000-00" 
                required 
                maxLength={14}
                onChange={handleChangeMask}
                value={formik.values.cpf}
            />

            {formik.errors.cpf && formik.touched.cpf &&<p class="text-xs text-red-700">{formik.errors.cpf}</p>}

            <div className='mt-16'>

                <button type='button' onClick={formik.handleSubmit} disabled={formik.isSubmitting} className="bg-blue-700 w-full hover:bg-blue-900 text-white font-bold py-4 px-4 border border-blue-700 rounded">
                Registrar
                </button>

            </div>
        </>
    )
}

export default FormLoginCpf