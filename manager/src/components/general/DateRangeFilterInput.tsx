import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslate } from "react-admin";
 
//greater then or equal
//lower then or equal~´
//between - [inicio, fim]
export interface IDateRangeFilterInput {
    gte?: string
    lte?: string
    between?: string[]
}

function checkIfValiddDate (date : string){
    const checkDate = Date.parse(date);
    if(isNaN(checkDate)) return false;
    //caso a data seja menor que 1 de Jan de 1970 (milsegs)
    if(checkDate<0) return false;
    return true;
}

//Este componente apenas serve para propósitos de filtrar a api de registos que contenham datas
//é obrigatório usar este componente dentro de forms , criados através do package "react-hook-forms", devido ao uso do useFormContext()

//source é o valor do atributo na tabela
const DateRangeFilterInput = ({
    source,
    label
} : {
    source : string,
    label ?: string
}) => {

    const { setValue } = useFormContext();
    const translate = useTranslate();

    //vars para mandar para o filtro
    const [inicio, setInicio] = useState<string | null>(null);
    const [fim, setFim] = useState<string | null>(null);

    //vars para controlar o valor dos inputs
    //ex dar clear ao valor
    const [inicioValue, setInicioValue] = useState<string>('');
    const [fimValue, setFimValue] = useState<string>('');

    function handleInicioDateChange(ev : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){

        if(ev.target.value===''){
            setInicio(null);
            setInicioValue('');
            return;
        }

        const isDateValid = checkIfValiddDate(ev.target.value);
        if(isDateValid) setInicio(new Date(ev.target.value).toISOString());
        setInicioValue(ev.target.value);
    }

    function handleFimDateChange(ev : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        
        if(ev.target.value===''){
            setFim(null);
            setFimValue('');
            return;
        }

        const isDateValid = checkIfValiddDate(ev.target.value);

        if(isDateValid) {
            const calcFimDate = new Date(ev.target.value);
            //é necessário fazer este calculo pois date.toISOString da, por ex, 2023-02-01:00:00:00:00
            //sendo que queremos o seguinte: 2023-02-01:23:59:59:59
            calcFimDate.setSeconds(calcFimDate.getSeconds() + ((60*60*24)-1) );
            setFim(new Date(calcFimDate).toISOString());
        }

        setFimValue(ev.target.value);
    }

    function clearInicioDate(){
        setInicio(null);
        setInicioValue('');
    }

    function clearFimDate(){
        setFim(null);
        setFimValue('');
    }

    useEffect(() => {

        if(!inicio && !fim){
            setValue(source, null);
            return;
        }

        if(inicio && fim) setValue(source, { between: [inicio, fim] });
        else if(inicio && !fim) setValue(source, { gte: inicio });
        else if(!inicio && fim) setValue(source, { lte: fim });

    }, [inicio, fim]);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Typography>{label ? translate(label) : translate(source)}</Typography>
            <Box sx={{ display: 'flex', gap: '10px' }}>
                <TextField 
                id="date-from"
                size="small" 
                label={translate('ra.action.range.from')}
                InputLabelProps={{
                    shrink: true
                }}
                value={inicioValue}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            { 
                                inicio 
                                ? 
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => clearInicioDate()}
                                    size="small"
                                >
                                    <Close />
                                </IconButton>
                                : 
                                null
                            }
                        </InputAdornment>
                    )
                }}
                onChange={(ev) => handleInicioDateChange(ev)}
                name="inicio" 
                type="date" 
                />
                <TextField 
                id="date-to"
                size="small" 
                label={translate('ra.action.range.to')} 
                InputLabelProps={{
                    shrink: true
                }}
                value={fimValue}
                InputProps={{ 
                    endAdornment: (
                        <InputAdornment position="end">
                            { 
                                fim 
                                ? 
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => clearFimDate()}
                                    size="small"
                                >
                                    <Close />
                                </IconButton>
                                : 
                                null
                            }
                        </InputAdornment>
                    )
                }}
                onChange={(ev) => handleFimDateChange(ev)}
                name="fim" 
                type="date" />
            </Box>
        </Box>
    );

}

export default DateRangeFilterInput;