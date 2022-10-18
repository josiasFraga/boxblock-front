import TextField from '@material-ui/core/TextField';

const FormCollection = (props) => {

    const formik = props.formik;


  return (
    <>
        <div className='w-full mt-3 font-medium'>
        Informações da Nova Coleção
        </div>

        <div className='w-full mt-2'>
        <TextField
            name="collectionName"
            error={formik.errors.collectionName && formik.touched.collectionName}
            id="collectionName"
            label="Nome da Coleção"
            defaultValue={formik.values.collectionName}
            onChange={formik.handleChange}
            helperText={formik.errors.collectionName}
            fullWidth
            variant="outlined"
            className={"bg-white"}
        />
        </div>

        <div className='w-full mt-2'>
        <TextField
            name="collectionSymbol"
            error={formik.errors.collectionSymbol && formik.touched.collectionSymbol}
            id="collectionSymbol"
            label="Símbolo da Coleção"
            defaultValue={formik.values.collectionSymbol}
            onChange={formik.handleChange}
            helperText={formik.errors.collectionSymbol}
            fullWidth
            variant="outlined"
            className={"bg-white"}
        />
        </div>
        <div className='w-full mt-2'>
        <TextField
            name="collectionTag"
            error={formik.errors.collectionTag && formik.touched.collectionTag}
            id="collectionTag"
            label="Tag da Coleção"
            defaultValue={formik.values.collectionTag}
            onChange={formik.handleChange}
            helperText={formik.errors.collectionTag}
            fullWidth
            variant="outlined"
            className={"bg-white"}
        />
        </div>
        <div className='w-full mt-2'>
        <TextField
            name="collectionDescription"
            error={formik.errors.collectionDescription && formik.touched.collectionDescription}
            id="collectionDescription"
            label="Descrição da Coleção"
            defaultValue={formik.values.collectionDescription}
            onChange={formik.handleChange}
            helperText={formik.errors.collectionDescription}
            fullWidth
            variant="outlined"
            className={"bg-white"}
            multiline
            size={"medium"}
            minRows={5}
        />
        </div>
        <div className='w-full mt-4'>
            <label className="block">
            <span className="text-sm">Imagem da Coleção</span>
            <input 
                type="file" 
                name='collectionCover'
                id='collectionCover'
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                onChange={(event) => {
                    formik.setFieldValue("collectionPhoto", event.currentTarget.files[0]);
                }}

            />
            </label>
            {formik.errors.collectionPhoto && formik.touched.collectionPhoto && <label className="invalid-feedback">{formik.errors.collectionPhoto}</label>}
        </div>
        <div className='w-full mt-4'>
            <label className="block">
            <span className="text-sm">Imagem de Capa</span>
            <input 
                type="file" 
                name='collectionCover'
                id='collectionCover'
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
                onChange={(event) => {
                    formik.setFieldValue("collectionCover", event.currentTarget.files[0]);
                }}
                />
            </label>
            {formik.errors.collectionCover && formik.touched.collectionCover && <label className="invalid-feedback">{formik.errors.collectionCover}</label>}
        </div>
  
    </>
  )
}

export default FormCollection
