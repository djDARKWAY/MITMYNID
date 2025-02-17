import { ListButton, SaveButton, Toolbar } from "react-admin";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { Add } from '@mui/icons-material';

const ToolbarCreateForm = ({listLink} : {listLink ?: string}) => {

    return(
        <Toolbar sx={{gap: '30px'}}>
            <SaveButton label="ra.action.create" icon={<Add/>}/>
            {listLink && listLink.trim().length>0 
            ? 
            <ListButton icon={<DoDisturbIcon/>} to={listLink} label={'ra.action.cancel'}/>
            :
            <ListButton icon={<DoDisturbIcon/>} label={'ra.action.cancel'}/>
            }
        </Toolbar>
    )
}

export default ToolbarCreateForm;