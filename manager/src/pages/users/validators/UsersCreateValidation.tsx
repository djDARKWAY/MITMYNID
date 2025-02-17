const validateUsersCreateForm = (values : any, isChecked: boolean) => {

    const errors = {};

    if (!values.person_name || (values.person_name && values.person_name.trim().length===0)) {
        //inves de passar mensagens podeomos passar identificadores para o i8onprovider
        //@ts-ignore
        errors.person_name = 'ra.validation.required'
    }
    //notar que ele aceita espaços
    /* else if(values.person_name && values.person_name.trim().length!==0 && !/^\S*[A-Za-zÀ-ÿ0-9 ._-]{2,}$/.test(values.person_name)){
        //@ts-ignore
        errors.person_name = 'resources.utilizadores.field_validation.name'
    } */

    if ((!values.username && !isChecked) || (values.username && values.username.trim().length===0)) {
        //inves de passar mensagens podeomos passar identificadores para o i8onprovider
        //@ts-ignore
        errors.username = 'ra.validation.required'
    }
    //username 3 caracteres no minimo sem espaços
    /* else if(values.username && values.username.trim().length!==0 && !/^\S*[a-zA-Z0-9_.@[\]-]{2,}$/.test(values.username)){
        //@ts-ignore
        errors.username = 'resources.utilizadores.field_validation.username'
    } */
    else if(values.username && values.username.trim().length!==0 && /\s/.test(values.username)){
        //@ts-ignore
        errors.username = 'resources.utilizadores.field_validation.username'
    }

    if(!values.email || (values.email && values.email.trim().length===0)){
        //@ts-ignore
        errors.email = 'ra.validation.required'
    }
    //deve conter pelo menos 2 caracteres antes e depois do @ e .
    //email valido: da@fa.pt
    /* else if(values.email && values.email.trim().length!==0 && !/^\S*(([a-zA-Z0-9\-.@_]*[a-zA-Z0-9]){1,})+@([a-z0-9-]{2,})+\.[a-z0-9]{2,}$/.test(values.email)){
        //@ts-ignore
        errors.email = 'resources.utilizadores.field_validation.email'
    } */
    else if(values.email && values.email.trim().length!==0 && /\s/.test(values.email)){
        //@ts-ignore
        errors.email = 'resources.utilizadores.field_validation.email'
    } 

    if(!values.password || (values.password && values.password.trim().length===0)){
        //@ts-ignore
        errors.password = 'ra.validation.required'
    }
    //minimo 6 caracateres, contendo pelo menos um numero
    else if(values.password && values.password.trim().length!==0 && /\s/.test(values.password)){
        //@ts-ignore
        errors.password = 'resources.utilizadores.field_validation.password'
    }

    if(values.address && values.address.trim().length===0){
        //@ts-ignore
        errors.address = 'ra.validation.invalid'
    }

    if(values.post_code && values.post_code.trim().length===0){
        //@ts-ignore
        errors.post_code = 'ra.validation.invalid'
    }
    /* else if(values.post_code && values.post_code.trim().length!==0 && !/^\S[0-9]\S*$/.test(values.post_code)){
        //@ts-ignore
        errors.post_code = 'resources.utilizadores.field_validation.cod_postal'
    } */

    if(values.nif && values.nif.trim().length===0){
        //@ts-ignore
        errors.nif = 'resources.utilizadores.field_validation.nif'
    }
    /* else if(values.nif && values.nif.trim().length!==0 && !/^\S[0-9]\S*$/.test(values.nif)){
        //@ts-ignore
        errors.nif = 'resources.utilizadores.field_validation.nif'
    } */

    if(values.nic && values.nic.trim().length===0){
        //@ts-ignore
        errors.nic = 'resources.utilizadores.field_validation.nic'
    }
    /* else if(values.nic && values.nic.trim().length!==0 && !/^\S[0-9]\S*$/.test(values.nic)){
        //@ts-ignore
        errors.nic = 'resources.utilizadores.field_validation.nic'
    } */

    if(values.cc_num && values.cc_num.trim().length===0){
        //@ts-ignore
        errors.cc_num = 'resources.utilizadores.field_validation.cc'
    }
    /* else if(values.cc_num && values.cc_num.trim().length!==0 && !/^\S[A-Z0-9]\S*$/.test(values.cc_num)){
        //@ts-ignore
        errors.cc_num = 'resources.utilizadores.field_validation.cc'
    } */

    if(values.phone && values.phone.trim().length===0){
        //@ts-ignore
        errors.phone = 'resources.utilizadores.field_validation.telefone'
    }
    /* else if(values.phone && values.phone.trim().length!==0 && !/^\S[0-9]*$/.test(values.phone)){
        //@ts-ignore
        errors.phone = 'resources.utilizadores.field_validation.telefone'
    } */

    if(values.mobile && values.mobile.trim().length===0){
        //@ts-ignore
        errors.mobile = 'resources.utilizadores.field_validation.telemovel'
    }
    /* else if(values.mobile && values.mobile.trim().length!==0 && !/^\S[0-9]*$/.test(values.mobile)){
        //@ts-ignore
        errors.mobile = 'resources.utilizadores.field_validation.telemovel'
    } */

    if(!values.roles || (values.roles && values.roles.length===0)){
        //@ts-ignore
        errors.roles = 'ra.validation.required'
    }

    return errors;
}

export default validateUsersCreateForm;