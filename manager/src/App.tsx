import './App.css';
import { Admin, CustomRoutes, fetchUtils, Resource } from 'react-admin';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nContextProvider } from "react-admin";

// Layout and Themes
import MyLayout from './components/layout';
import themes from './components/layout/themes';
import SignIn from './components/layout/login';
import Register from './components/layout/register';

// Providers
import lb4Provider from './utils/data-provider';
import { authProvider } from './utils/authProvider';
import { i18nProvider } from './components/i18n';

// Pages
import Dashboard from './pages/dashboard';
import Configuration from './pages/configuration/Configuration';
import Profile from './pages/configuration/Profile';
import { Unauthorized } from './components/general/Unauthorized';
import StatusTest from './pages/status/StatusTest';
import StatusTestv2 from './pages/status/StatusTestv2';
import CertificatesUpload from './pages/certificates/CertificatesUpload';

// Resources
import { roles } from './pages/roles';
import { users } from './pages/users';
import { validateUsers } from './pages/ValidateUsers';
import { certificates } from './pages/certificates';
import { accessPoints } from './pages/accessPoints';
import { warehouses } from './pages/warehouses';
import { logs } from './pages/logs';

// Lists
import { CertificatesList } from './pages/certificates/CertificatesList';
import { AccessPointsList } from './pages/accessPoints/AccessPointsList';
import { WarehousesList } from './pages/warehouses/WarehousesList';
import { LogsList } from './pages/logs/LogsList';
import WarehousesMap from './pages/warehouses/WarehousesMap';
import UsersLogs from './pages/users/UsersLogs';

const httpClient = (url: string, options = {}) => {
  return fetchUtils.fetchJson(url, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

const aggregate = (resource: any) => {
  return [];
};

export let url = import.meta.env.VITE_REST_API ? import.meta.env.VITE_REST_API : 'http://127.0.0.1:13001/';
const dataProvider = lb4Provider(url, aggregate, httpClient);
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
        <Route
            path="/register"
            element={
              <I18nContextProvider value={i18nProvider}>
                <Register />
              </I18nContextProvider>
            }
          />
          <Route path="/*" element={
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
              {(permissions?: string[]) => [
                <Resource name="users" {...users(permissions)} recordRepresentation={(record) => record.person_name} />,
                <Resource name="validateUsers" {...validateUsers(permissions)} recordRepresentation={(record) => record.person_name} />,
                <Resource name="roles" {...roles(permissions)} />,
                <Resource name="user-roles" />,
                <Resource name="certificates" {...certificates(permissions)} />,
                <Resource name="access-points" {...accessPoints(permissions)} />,
                <Resource name="warehouses" {...warehouses(permissions)} />,
                <Resource name="logs" {...logs(permissions)} />,

                <CustomRoutes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/configuration" element={<Configuration />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/certificates" element={<CertificatesList />} />
                  <Route path="/access-points" element={<AccessPointsList />} />
                  <Route path="/warehouses" element={<WarehousesList />} />
                  <Route path="/warehouses-map" element={<WarehousesMap />} />
                  <Route path="/logs" element={<LogsList />} />
                  <Route path="/status-test" element={<StatusTest />} />
                  <Route path="/status-testv2" element={<StatusTestv2 />} />
                  <Route path="/unauthorized" key={"/unauthorized"} element={<Unauthorized />} />
                  <Route path="/users-logs" element={<UsersLogs />} />
                  <Route path="/upload" element={<CertificatesUpload />} />
                </CustomRoutes>,
              ]}
            </Admin>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
