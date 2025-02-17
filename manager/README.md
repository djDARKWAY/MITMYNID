# Projeto Base - Manager

## Requisitos

Antes de começar, certifique-se de ter o [Node.js](https://nodejs.org/en) instalado no seu sistema.

## Instalação

1. **Instalar dependências**

   ```sh
   npm install
   npm install -g typescript
   ```

2. **Iniciar o projeto**

   ```sh
   npm start
   ```

## Documentação

Para mais informações sobre as tecnologias utilizadas, consulte:

- [React-admin](https://marmelab.com/react-admin/Readme.html)
- [MUI (Material-UI)](https://mui.com/material-ui/getting-started/)
- [MUI Icons](https://mui.com/material-ui/material-icons/)

## Personalização (Opcional)

### 1. Adicionar um recurso

Edite o ficheiro `src/App.tsx` e adicione a seguinte linha:

```tsx
<Resource name="validateUsers" {...validateUsers(permissions)} recordRepresentation={(record) => record.person_name} />
```

### 2. Adicionar itens ao menu lateral

Edite o ficheiro `src/components/layout/menu.tsx` e adicione o seguinte código:

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
