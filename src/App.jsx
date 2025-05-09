import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { RoleProvider } from './context/RoleContext';
import { ProviderProvider } from './context/ProviderContext';
import { NotificationProvider } from './components/NotificationSystem';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <ProviderProvider>
          <NotificationProvider>
            <BookingProvider>
              <RouterProvider router={router} />
            </BookingProvider>
          </NotificationProvider>
        </ProviderProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
