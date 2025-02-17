import { useEffect, useRef } from "react";
import { useRemoveFromStore, useResourceContext, useStore } from "react-admin";

//por favor incluir no inicio de todos os componentes incluidos dentro da dashboard
//componentes chamados dentro do <Resource> ou <CustomRoutes (sem atributo noLayout)>

//custom hook para verificar o resource name 
//que irá ser consumido pelo menu
//mudando o estado do submenu para expandido caso esteja em uma das opções do mesmo e faça reload à página
//caso isso não se verifique ele fecha os submenus
function useCheckResourceLocale(){

    const ref = useRef(false);

    const resource = useResourceContext();

    //varios submenus e seus recursos
    const menuConfig : Array<string> = ['recurso1', 'recurso2', 'recurso3', 'recurso3', 'recurso4'];
    const menuSeguranca : Array<string> = ['users', 'roles'];

    const [res, setResource] = useStore('resource.name', 'none'); 
    const remove = useRemoveFromStore('resource.name');

    useEffect(() => {
        if(ref.current) return
        ref.current = true

        if(typeof resource!=="undefined" && res!==resource && (menuConfig.includes(resource) || menuSeguranca.includes(resource))){

            switch(true){
                case menuConfig.includes(resource):
                    setResource('menuConfig');
                    break;
                case menuSeguranca.includes(resource):
                    setResource('menuSeguranca');
                    break;
                default:
                    break;
            }
            
        } else {
            remove()
        }

    });

    return
}

export default useCheckResourceLocale;