import Chip from '@mui/material/Chip';
import { useRecordContext } from 'react-admin';
import { Box } from "@mui/material";
import { Roles } from '../../utils/types';

const RolesField = () => {
  const record = useRecordContext();

  const roles = record?.tempRoles ? record.tempRoles : record?.roles

  return record ? (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: -0.5, mb: -0.5 }}>
      {roles &&
        roles.map((role: Roles) => {
          return role ? (
            <Chip
              key={role.id}
              sx={{ m: 0.5 }}
              label={role.description}
              clickable={false}
            />
          ) : null;
        })
      }
    </Box>
  ) : null;
};

RolesField.defaultProps = {
  addLabel: true,
  source: 'roles',
};

export default RolesField;
