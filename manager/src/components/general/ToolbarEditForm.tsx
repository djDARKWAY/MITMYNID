import { Button, DeleteWithConfirmButton, ListButton, SaveButton, Toolbar, useGetRecordId, useNotify, useRedirect } from "react-admin";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { Box } from "@mui/material";
import { url } from "../../App";

const ToolbarEditForm = ({ listLink, deleteLink, hasDelete }: { listLink?: string, deleteLink?: string, hasDelete?: boolean }) => {

  return (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: '30px' }}>
        <SaveButton />
        {listLink && listLink.trim().length > 0
          ?
          <ListButton icon={<DoDisturbIcon />} to={listLink} label={'ra.action.cancel'} />
          :
          <ListButton icon={<DoDisturbIcon />} label={'ra.action.cancel'} />
        }
      </Box>
      {deleteLink && deleteLink.trim().length > 0
        ?
        <DeleteWithConfirmButton redirect={deleteLink} label="ra.action.delete" confirmContent="ra.message.delete_content" />
        :
        hasDelete || hasDelete === undefined
          ?
          <DeleteWithConfirmButton label="ra.action.delete" confirmContent="ra.message.delete_content" />
          :
          <></>
      }
    </Toolbar>
  )
}

export const ToolbarValidateForm = ({ listLink, deleteLink, hasDelete }: { listLink?: string, deleteLink?: string, hasDelete?: boolean }) => {
  const recordId = useGetRecordId()
  const notify = useNotify()
  const redirect = useRedirect()
  return (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: '30px' }}>

        <Button variant="contained" color="success" size="medium" label="ra.action.validate" onClick={async () => {
          await fetch(url + '/validateUsers/' + recordId + '/validate', {
            headers: new Headers({
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem('token') ? localStorage.getItem('token') : ''}`
            }),
          })
            .then((resp) => {
              if (resp.status < 200 || resp.status > 300) throw new Error(resp.statusText);

              notify('ra.action.success', { type: 'success' })
              redirect(listLink ?? '/validateUsers')
            })
            .catch((err) => notify(err.message, { type: 'error' }))
        }} />

        {listLink && listLink.trim().length > 0
          ?
          <ListButton icon={<DoDisturbIcon />} to={listLink} label={'ra.action.cancel'} />
          :
          <ListButton icon={<DoDisturbIcon />} label={'ra.action.cancel'} />
        }
      </Box>
      {deleteLink && deleteLink.trim().length > 0
        ?
        <DeleteWithConfirmButton redirect={deleteLink} label="ra.action.delete" confirmContent="ra.message.delete_content" />
        :
        hasDelete || hasDelete === undefined
          ?
          <DeleteWithConfirmButton label="ra.action.delete" confirmContent="ra.message.delete_content" />
          :
          <></>
      }
    </Toolbar>
  )
}

export default ToolbarEditForm;
