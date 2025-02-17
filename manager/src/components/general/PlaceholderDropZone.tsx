import { IconButtonWithTooltip, useTranslate } from "react-admin";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const PlaceholderDropZone = () => {

  const translate = useTranslate();

  return (
      <Box sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
      }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Box sx={{ height: 'max-content' }}>
                  <IconButtonWithTooltip
                      label=""
                      onClick={()=> {}}
                      // variant='contained'
                      /* sx={{
                          boxShadow: 'none',
                          '&:hover': {
                              background: theme=>theme.palette.primary.main,
                              boxShadow: 'none'
                          }
                      }} */
                  >
                      <Add color="primary" sx={{ fontSize: '3rem' }} />
                  </IconButtonWithTooltip>
              </Box>
              <Box sx={{
                  height: 'max-content'
              }}>
                  <Typography sx={{ fontSize: '20px', textAlign: 'center' }}>
                      {translate('Carregar')}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', textAlign: 'center' }}>
                      {translate('máximo')}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', textAlign: 'center' }}>
                      {translate('3 fotos / 5MB')}
                  </Typography>

              </Box>
          </Box>
      </Box>
  );
}

export const PlaceholderDropZonePDF = () => {

  const translate = useTranslate();

  return (
      <Box sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
      }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Box sx={{ height: 'max-content' }}>
              <IconButtonWithTooltip
                      label=""
                      onClick={()=> {}}
                      // variant='contained'
                      disabled={import.meta.env.VITE_CONNECTS_TO_GP && import.meta.env.VITE_CONNECTS_TO_GP === "true"}
                      /* sx={{
                          boxShadow: 'none',
                          '&:hover': {
                              background: theme=>theme.palette.primary.main,
                              boxShadow: 'none'
                          }
                      }} */
                  >
                      <UploadFileIcon color="primary" sx={{ fontSize: '3rem' }} />
                  </IconButtonWithTooltip>
              </Box>
              <Box sx={{
                  height: 'max-content'
              }}>
                  <Typography sx={{ fontSize: '20px', textAlign: 'center' }}>
                      {translate('Carregar')}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', textAlign: 'center' }}>
                      {translate('máximo')}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', textAlign: 'center' }}>
                      {translate('3 ficheiros / 5MB')}
                  </Typography>

              </Box>
          </Box>
      </Box>
  );
}

export default PlaceholderDropZone;
