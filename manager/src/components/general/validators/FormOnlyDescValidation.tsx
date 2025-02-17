const validateFormOnlyDesc = (values : any) => {

    const errors = {};

    if (!values.descricao || (values.descricao && values.descricao.trim().length===0)) {
        //inves de passar mensagens podeomos passar identificadores para o i8onprovider
        //@ts-ignore
        errors.descricao = 'ra.validation.required'
    }
    //notar que ele aceita espaços
    /*else if(values.descricao && values.descricao.trim().length!==0 && !/^\S[A-Za-zÀ-ÿ-0-1 -]{3,}$/.test(values.descricao)){
        //@ts-ignore
        errors.descricao = 'ra.validation.invalid'
    }*/

    return errors;
}

export default validateFormOnlyDesc;