import { IconButtonWithTooltip, useTranslate } from "react-admin";
import { useNavigate } from 'react-router-dom';
import { SxProps, Theme } from '@mui/system';

export const commonListCSS = {
    borderRadius: '8px',
    padding: '3px 13px 3px 13px',
    '& .MuiSvgIcon-root': {
        fontSize: '18px',
    }
}

const CustomButtonToolTip = (
    {
        label,
        sx,
        icon,
        action,
        id,
        resource,
        size,
        disabled,
        color
    }:{
        label: string,
        sx?: SxProps<Theme>,
        icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
        action: 'show' | 'edit' | 'list' | 'redirect',
        id: string,
        resource: string,
        size?: "small" | "medium" | "large",
        disabled?: boolean | undefined,
        color?: "inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
    }
) => {

    const navigate = useNavigate();
    const translate = useTranslate();
    
    async function redirectTo(){

        if(action==='list'){

            navigate(`/${resource}/list`);
            
        }
        else if(action==='redirect') {
            navigate(`/${resource}/${id}`);
        } 
        else {
            navigate(`/${resource}/${id}/${action}`);
        }

    }

    return(
        <IconButtonWithTooltip 
        color={color ? color : "primary"}
        size={size ? size : 'medium'} 
        sx={sx ? sx : {}} 
        label={translate(label)} 
        onClick={() => redirectTo()}
        disabled={disabled ? disabled : false}
        >
            {icon ? icon : null}
        </IconButtonWithTooltip>
    )
}

export default CustomButtonToolTip;
