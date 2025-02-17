export const responsiveListFilter = {
    '& .MuiToolbar-root':{
        flexDirection: {
            xs: 'column-reverse',
            md: 'row'
        },
        '& .MuiToolbar-gutters': {
            minHeight: 'max-content',
            paddingBottom: '8px'
        },
        '& form':{
            width: '100%'
        }
    },
    '& form .RaFilterForm-filterFormInput':{
        width: {
            xs: '100%',
            md: 'max-content'
        },
        '&.filter-field .ra-input': {
            width: '100%'
        }
    }
}

export const responsiveTaterfasListFilter = {
    '& form':{
        flexDirection: {
            xs: 'column-reverse',
            md: 'row'
        },
    },
    '& form .RaFilterForm-filterFormInput':{
        width: {
            xs: '100%',
            md: 'max-content'
        },
        '&.filter-field .ra-input': {
            width: '100%'
        }
    }
}

export const customDropZone = {
    //@ts-ignore
    color: theme => theme.palette.mode==="dark" ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    '& .RaLabeled-label': {
        flex: '1 0 100%',
        paddingBottom: '5px',
        paddingLeft: '5px'
    },
    '& .RaFileInput-dropZone':{
        //border: '1px solid rgb(145, 158, 171, 0.4)',
        background: 'transparent',
        boxShadow: '0px 0px 5px rgb(145, 158, 171, 0.4)',
        fontFamily: 'Public Sans,sans-serif',
        width: '250px',
        height: '300px'
    } ,
    '& .RaImageField-image': {
        width: '250px', 
        height: '300px',
        margin: '0px',
        padding: {
            xs: '10px 0px 0px 0px',
            md: '0px 0px 0px 20px'
        }
    }
}