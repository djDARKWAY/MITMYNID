import { FC } from 'react';
import { FieldProps } from 'react-admin';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { green, red } from '@mui/material/colors';

export const BooleanField: FC<FieldProps> = ({ source, record = {} }) => {
    return record[source] ? (
        <CheckIcon style={{ color: green[500] }} />
    ) : (
        <CloseIcon style={{ color: red[500] }} />
    );
};
