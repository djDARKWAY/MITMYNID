# Projeto Base - Manager

## Requisitos

[Nodejs](https://nodejs.org/en)

## Instalação

1. Instalar dependências

```sh
    npm install
    npm install -g typescript
```

2. Start

```sh
    npm start
```

## Documentação

[React-admin](https://marmelab.com/react-admin/Readme.html)\
[MUI](https://mui.com/material-ui/getting-started/)\
[MUI Icons](https://mui.com/material-ui/material-icons/)

Adicionar recurso

`src\App.tsx`

```tsx
  <Resource name="validateUsers" {...validateUsers(permissions)} recordRepresentation={(record) => record.person_name} />,
```

Adicionar items ao menu lateral

`src\components\layout\menu.tsx`
```tsx
    <MenuItemLink
      to={{ pathname: "/users" }}
      className={"submenuItem " + (open ? 'open' : 'close')}
      primaryText={translate(`resources.utilizadores.name`)}
      sx={{ color: !open ? 'transparent' : 'default' }}
      leftIcon={<People />}
      dense={dense}
    />
```
