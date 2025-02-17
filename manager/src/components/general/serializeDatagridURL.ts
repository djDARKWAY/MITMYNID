//Função usada para formatar urls válidas para o filtro do componente Datagrid

const serializeDatagridURL : any = function (obj : any, nested: boolean) {

    //p corresponde ao nome do atributo dentro do objeto
    //nested é para validar caso é um atributo dentro do objeto inicial ou dentro de outro atributo
    /*
        { -----> não nested
            nome: asjfasfhsjafh, -----> não nested
            nome2: {
                coisa: 1111111 -----> nested
            }
        }
        
        isto pois os atributos neste precisam de ter o seguinte formato na url
            nome2={coisa: 1111111}
        sem esta implementação ficariam com o seguinte formato
            nome2:{coisa: 1111111}
    */
   /*
        neste caso particular precisamos de obter a seguinte url

        {
            coisa: true
        },
        nome2 = {
            coisa: 1111111 
        }}
        
        mas como os atributos antes de serem serializados tem que ter sempre um nome do atributo foi implementado o atributo "nested"
        sempre que um atributo conter o nome nested este é ignorado

        de:
            nested: {
                coisa: true
            },
            nested2: {
                coisa2: true
            },
            nome2: {
                coisa: 1111111 
            }}
        para:
            {
                "coisa": true
            }
            &
            {
                "coisa2": true
            }
            &
            nome2 = {
                "coisa": 1111111,
                "coisa2": 1111111,
                "coisa3": 1111111 
            }}
   */
    var str = [], p;
    for (p in obj) {

        if (obj.hasOwnProperty(p)) {

            var k = p, v = obj[p];

            if((v !== null && typeof v === "object")){

                if(p.includes('nested')){
                    str.push("%7B" + serializeDatagridURL(v, true) + "%7D")
                } else {
                    str.push(encodeURIComponent(k) + "=%7B" + serializeDatagridURL(v, true) + "%7D")
                }

            } else {
                str.push(
                    (nested ? ('"' + encodeURIComponent(k) + '"') : encodeURIComponent(k)) + 
                    `${nested ? "%3A" : "="}` + 
                    (typeof v==='string' && nested ? ('"' + encodeURIComponent(v) + '"') : encodeURIComponent(v))
                )
            }
        
            
        }
    }
    
    return str.join(nested ? "," : "&");
}

export default serializeDatagridURL;