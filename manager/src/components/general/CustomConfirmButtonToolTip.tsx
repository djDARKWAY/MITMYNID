//Este botão serve apenas para eliminar
import { Confirm, IconButtonWithTooltip, useDataProvider, useNotify, useRefresh, useTranslate } from "react-admin";
import { SxProps, Theme } from '@mui/system';
import { useState } from "react";

const itemDefaultMessages = {
  delete: {
    title: 'ra.message.delete_title',
    content: 'ra.message.delete_content'
  }
}

const CustomConfirmButtonToolTip = (
  {
    id,
    resource,
    label,
    sx,
    icon,
    color,
    size,
    disabled,
    dialogueTitle,
    dialogueContent
  }: {
    id: string,
    resource: string,
    label: string,
    sx?: SxProps<Theme>,
    icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
    color?: "inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning",
    size?: "small" | "medium" | "large",
    disabled?: boolean | undefined,
    dialogueTitle?: string,
    dialogueContent?: string
  }
) => {

  const translate = useTranslate();
  const [open, setOpen] = useState<boolean>(false);
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const notify = useNotify();

  const handleDialogOpen = (e: any) => { e.stopPropagation(); setOpen(true) };

  const handleDialogClose = () => setOpen(false);

  const onConfirm = async () => {

    dataProvider.delete(resource, { id: id }).then(() => {
      notify('ra.notification.deleted', { type: 'info', messageArgs: { smart_count: 1 } });
      refresh();
    }).catch(() => {
      notify('ra.notification.deleted_error', { type: 'error' });
    });

    setOpen(false);
    //handleDialogClose();
  }

  return (
    <>
      <IconButtonWithTooltip
        color={color ? color : "primary"}
        size={size ? size : 'medium'}
        sx={sx ? sx : {}}
        label={translate(label)}
        onClick={handleDialogOpen}
        disabled={disabled ? disabled : false}
      >
        {icon ? icon : null}
      </IconButtonWithTooltip>
      <Confirm
        isOpen={open}
        title={dialogueTitle ? translate(dialogueTitle) : itemDefaultMessages.delete.title}
        content={dialogueContent ? translate(dialogueContent) : itemDefaultMessages.delete.content}
        onConfirm={onConfirm}
        onClose={handleDialogClose}
      />
    </>

  )
}

export default CustomConfirmButtonToolTip;
