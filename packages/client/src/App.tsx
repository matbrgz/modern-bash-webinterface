import { Routes, Route } from 'react-router-dom';
import { AdvancedThemeProvider } from '@/components/advanced-theme-provider';
import { ThemeCustomizer } from '@/components/theme-customizer';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout';
import { Dashboard } from '@/pages/Dashboard';
import { CommandExecutor } from '@/pages/CommandExecutor';
import History from '@/pages/History';
import { Login } from '@/pages/Login';
import { useAuth } from '@/hooks/useAuth';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdvancedThemeProvider defaultTheme="default" storageKey="shellui-advanced-theme">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/command/:id" element={<CommandExecutor />} />
                  <Route path="/history" element={<History />} />
                </Routes>
                <ThemeCustomizer />
              </Layout>
            ) : (
              <Login />
            )
          }
        />
      </Routes>
      <Toaster />
    </AdvancedThemeProvider>
  );
}

export default App; 
