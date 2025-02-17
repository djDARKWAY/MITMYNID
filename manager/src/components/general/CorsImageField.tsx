import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { SxProps } from '@mui/system';
import { FieldProps, sanitizeFieldRestProps, useRecordContext, useTranslate } from 'react-admin';
import { url } from '../../App';

export function formatLogo(value: any) {
  if (typeof value === "string") { // Value is null or the url string from the backend, wrap it in an object so the form input can handle it
    // console.log({ src: url + value })
    return { src: url + value };
  } else {  // Else a new image is selected which results in a value object already having a preview link under the url key
    return value;
  }
}

/**
 *
 * @param props
 * @returns
 */
const CorsImageField = <
    RecordType extends Record<string, any> = Record<string, any>
>(
    props: ImageFieldProps<RecordType>
) => {
    const { className, emptyText, source, src, title, ...rest } = props;
    const record = useRecordContext(props);
    const sourceValue = get(record, source ? source : '');
    const translate = useTranslate();

    if (!sourceValue) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        ) : (
            <Typography
                component="div"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            />
        );
    }

    if (Array.isArray(sourceValue)) {
        return (
            <Root className={className} {...sanitizeFieldRestProps(rest)}>
                <ul className={ImageFieldClasses.list}>
                    {sourceValue.map((file : any, index : any) => {
                        const fileTitleValue = title ? get(file, title) : title;
                        const srcValue = src ? get(file, src) : title;

                        return (
                            <li key={index}>
                                <img
                                    alt={fileTitleValue}
                                    title={fileTitleValue}
                                    src={srcValue}
                                    style={{height:150, width: 150}}
                                    className={ImageFieldClasses.image}
                                    crossOrigin="use-credentials"
                                />
                            </li>
                        );
                    })}
                </ul>
            </Root>
        );
    }

    const titleValue = title ? get(record, title)?.toString() : title;

    return (
        <Root className={className} {...sanitizeFieldRestProps(rest)}>
            <img
                title={titleValue}
                alt={titleValue}
                src={sourceValue?.toString()}
                style={{height:150, width: 150, objectFit:'cover'}}
                className={ImageFieldClasses.image}
                crossOrigin="use-credentials"
            />
        </Root>
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
CorsImageField.displayName = 'CustomImageField';

CorsImageField.propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    crossOrigin: PropTypes.string,
    src: PropTypes.string,
    title: PropTypes.string,
};

const PREFIX = 'RaImageField';

const ImageFieldClasses = {
    list: `${PREFIX}-list`,
    image: `${PREFIX}-image`,
};

const Root = styled(Box, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${ImageFieldClasses.list}`]: {
        display: 'flex',
        listStyleType: 'none',
    },
    [`& .${ImageFieldClasses.image}`]: {
        // margin: '0.25rem',
        // width: 200,
        // height: 100,
        objectFit: 'contain',
    },
});

interface ImageFieldProps<
    RecordType extends Record<string, any> = Record<string, any>
> extends FieldProps<RecordType> {
    src?: string;
    title?: string;
    sx?: SxProps;
}

export default CorsImageField;
