import { useEffect, useState } from "react";
import { Modal, Button, Label, TextInput, Checkbox } from "flowbite-react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

const ModalPrice = ({ show, setShow, putToSell, putToAuction }) => {

  const [initialValues, setInitialValues] = useState(
    {
        precoFixo: true,
        preco: "",
        lanceMinimo: "",
    }
  )

  const validation = yup.object().shape({
    precoFixo: yup.boolean(),
    preco: yup
      .number()
      .required("Digite o valor do item"),
    lanceMinimo: yup
      .number()
      .nullable()
      .when("precoFixo", {
        is: false,
        then: yup.number("Digite uma valor válido").required("Digite o valor do lance mínimo")
      }),
  })

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values, {setSubmitting, resetForm}) => {
        setSubmitting(true);
        if ( values.precoFixo ) {
            await putToSell(values.preco);
        } else {
            await putToAuction(values.preco, values.lanceMinimo);
        }
        resetForm();
        setSubmitting(false);
        setShow(false);
    },
    validationSchema: validation
  });
  return (
    <>
        <BlockUi tag="div" blocking={formik.isSubmitting}>
            <Modal show={show} size="md" popup={true} onClose={() => { setShow(false) }}>
                <Modal.Header />
                <Modal.Body>
                <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-0 xl:pb-8">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Dados da Venda
                    </h3>
                </div>
                <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Checkbox 
                            id="precofixo"
                            checked={formik.values.precoFixo} 
                            onChange={(evt) => {
                              formik.setFieldValue("precoFixo", evt.target.checked);
                            }}
                        />
                        <Label htmlFor="precofixo">Preço Fixo?</Label>
                    </div>
                </div>
                <div className="mb-4 block">
                    <Label htmlFor="price" value="Preço" />
                    <TextInput 
                        id="preco" 
                        placeholder="em Eth"
                        value={formik.values.preco}
                        onChange={formik.handleChange} 
                    />
            	    {formik.errors.preco && formik.touched.preco && <label className="invalid-feedback">{formik.errors.preco}</label>}
                </div>

                {!formik.values.precoFixo && 
                    <div className="mb-4 block">
                        <Label htmlFor="price" value="Lance Mínimo" />
                        <TextInput 
                            id="lanceMinimo" 
                            placeholder="em Eth"
                            value={formik.values.lanceMinimo}
                            onChange={formik.handleChange} 
                        />
                        {formik.errors.lanceMinimo && formik.touched.lanceMinimo && <label className="invalid-feedback">{formik.errors.lanceMinimo}</label>}
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
                        <Button className={"w-full"} onClick={formik.handleSubmit} disabled={formik.isSubmitting}>Colocar NFT a Venda</Button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </BlockUi>
    </>
  );
};

export default ModalPrice;