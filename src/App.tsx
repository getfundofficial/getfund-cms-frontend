import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewsListPage } from './pages/NewsListPage';
import { NewsEditorPage } from './pages/NewsEditorPage';
import { NewsViewPage } from './pages/NewsViewPage';
import { HeroSlidesListPage } from './pages/HeroSlidesListPage';
import { HeroSlideEditorPage } from './pages/HeroSlideEditorPage';
import { HeroSlideViewPage } from './pages/HeroSlideViewPage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { ApprovalQueuePage } from './pages/ApprovalQueuePage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import UsersListPage from './pages/UsersListPage';
import { PagesListPage } from './pages/PagesListPage';
import { PageEditorPage } from './pages/PageEditorPage';
import { PagePermissionsPage } from './pages/PagePermissionsPage';
import { SectionEditorPage } from './pages/SectionEditorPage';
import { MenuManagementPage } from './pages/MenuManagementPage';
import { TeamMembersListPage } from './pages/TeamMembersListPage';
import ImpactStatsManager from './components/ImpactStatsManager';
import FooterConfigEditor from './components/FooterConfigEditor';
import { CampaignsListPage } from './pages/CampaignsListPage';
import { CampaignEditorPage } from './pages/CampaignEditorPage';
import { LotteryConfigPage } from './pages/LotteryConfigPage';
import { LotteryEntriesPage } from './pages/LotteryEntriesPage';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import { AdminLayout } from './components/Layout/AdminLayout';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <DashboardPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* News Routes */}
          <Route
            path="/admin/news"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewsListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news/new"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewsEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewsViewPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news/:id/edit"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <NewsEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Hero Slides Routes */}
          <Route
            path="/admin/hero-slides"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <HeroSlidesListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/hero-slides/new"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <HeroSlideEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/hero-slides/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <HeroSlideViewPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/hero-slides/:id/edit"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <HeroSlideEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Review Queue Route */}
          <Route
            path="/admin/review"
            element={
              <ProtectedRoute requiredRoles={['reviewer', 'admin']}>
                <AdminLayout>
                  <ReviewQueuePage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Approval Queue Route */}
          <Route
            path="/admin/approval"
            element={
              <ProtectedRoute requiredRoles={['approver', 'admin']}>
                <AdminLayout>
                  <ApprovalQueuePage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Audit Logs Route (Admin Only) */}
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <AuditLogsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Media Library Route */}
          <Route
            path="/admin/media"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <MediaLibraryPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Users Management Route (Admin Only) */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <UsersListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Menu Management Route (Admin Only) */}
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <MenuManagementPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Team Members Route */}
          <Route
            path="/admin/team-members"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <TeamMembersListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Impact Stats Route */}
          <Route
            path="/admin/impact-stats"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ImpactStatsManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Footer Settings Route */}
          <Route
            path="/admin/footer-settings"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <FooterConfigEditor />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Pages CMS Routes */}
          <Route
            path="/admin/pages"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <PagesListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pages/new"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <PageEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pages/:slug/permissions"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <PagePermissionsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pages/:slug"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <PageEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pages/:slug/sections/new"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <SectionEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pages/:slug/sections/:sectionKey"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <SectionEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Campaigns Routes */}
          <Route
            path="/admin/campaigns"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CampaignsListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/campaigns/new"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <CampaignEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/campaigns/:slug"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CampaignEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/campaigns/:slug/edit"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <CampaignEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Lottery Routes */}
          <Route
            path="/admin/lottery/config"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <LotteryConfigPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/lottery/entries"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout>
                  <LotteryEntriesPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
