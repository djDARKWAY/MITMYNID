import './App.css';
import lb4Provider from './utils/data-provider';
import { Admin, CustomRoutes, fetchUtils, Resource } from 'react-admin';
import MyLayout from './components/layout';
import { roles } from './pages/roles';
import { users } from './pages/users';
import { authProvider } from './utils/authProvider';
import SignIn from './components/layout/login';
import { i18nProvider } from './components/i18n';
import { Route } from 'react-router-dom';
import Configuration from './pages/configuration/Configuration';
import themes from './components/layout/themes';
import Profile from './pages/configuration/Profile';
import { Unauthorized } from './components/general/Unauthorized';
import Dashboard from './pages/dashboard';
import Register from './components/layout/register';
import { validateUsers } from './pages/ValidateUsers';
import { CertificatesList } from './pages/certificates/CertificatesList';
import { certificates } from './pages/certificates';
import { AccessPointsList } from './pages/accessPoints/AccessPointsList';
import { accessPoints } from './pages/accessPoints';
import { CompaniesList } from './pages/companies/CompaniesList';
import { companies } from './pages/companies';
import StatusTest from './pages/status/StatusTest';

const httpClient = (url: string, options = {}) => {
  //@ts-ignore
  //options.headers = new Headers({ Accept: "application/json", Authorization: `Bearer ${localStorage.getItem('token') ? localStorage.getItem('token') : ''}` });

  return fetchUtils.fetchJson(url, options);
};

const aggregate = (resource: any) => {
  // switch(resource){
  //   case 'users':
  //     return [
  //       {
  //         relation: "roles",
  //       },
  //     ];
  //   default:
  //     break;
  // }
  return [];
};

export let url = import.meta.env.VITE_REST_API ? import.meta.env.VITE_REST_API : 'http://127.0.0.1:13001/';
const dataProvider = lb4Provider(url, aggregate, httpClient);

const App = () => {
  return (
    <Admin
      lightTheme={themes['light']}
      darkTheme={themes['dark']}
      defaultTheme='light'
      layout={MyLayout}
      authProvider={authProvider}
      loginPage={SignIn}
      dashboard={Dashboard}
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      disableTelemetry
      requireAuth
    >
      {(permissions?: string[]) => {
        return [
          <Resource name="users" {...users(permissions)} recordRepresentation={(record) => record.person_name} />,
          <Resource name="validateUsers" {...validateUsers(permissions)} recordRepresentation={(record) => record.person_name} />,
          <Resource name="roles" {...roles(permissions)} />,
          <Resource name="user-roles" />,
          <Resource name="certificates" {...certificates(permissions)} />,
          <Resource name="access-points" {...accessPoints(permissions)} />,
          <Resource name="companies" {...companies(permissions)} />,

          <CustomRoutes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/certificates" element={<CertificatesList />} />
            <Route path="/access-points" element={<AccessPointsList />} />
            <Route path="/companies" element={<CompaniesList />} />
            <Route path="/status-test" element={<StatusTest />} />

            <Route path="/unauthorized" key={"/unauthorized"} element={<Unauthorized />} />
          </CustomRoutes>,
        ]
      }}
    </Admin>
  );
}

export default App;
