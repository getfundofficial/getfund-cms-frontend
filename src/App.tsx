import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ForcePasswordChangePage } from './pages/ForcePasswordChangePage';
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
import { PartnersListPage } from './pages/PartnersListPage';
import ImpactStatsManager from './components/ImpactStatsManager';
import FooterConfigEditor from './components/FooterConfigEditor';
import { CampaignsListPage } from './pages/CampaignsListPage';
import { CampaignEditorPage } from './pages/CampaignEditorPage';
import { LotteryConfigPage } from './pages/LotteryConfigPage';
import { LotteryEntriesPage } from './pages/LotteryEntriesPage';
import { PledgesPage } from './pages/PledgesPage';
import { ImpactDonationsPage } from './pages/ImpactDonationsPage';
import { DonationsPage } from './pages/DonationsPage';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import { AdminLayout } from './components/Layout/AdminLayout';
import EfpiEditorPage from './pages/EfpiEditorPage';
import EfpiSubmissionsPage from './pages/EfpiSubmissionsPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/change-password" element={<ForcePasswordChangePage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredNavPermission="dashboard">
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
              <ProtectedRoute requiredNavPermission="news">
                <AdminLayout>
                  <NewsListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news/new"
            element={
              <ProtectedRoute requiredNavPermission="news">
                <AdminLayout>
                  <NewsEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news/:id"
            element={
              <ProtectedRoute requiredNavPermission="news">
                <AdminLayout>
                  <NewsViewPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news/:id/edit"
            element={
              <ProtectedRoute requiredNavPermission="news">
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
              <ProtectedRoute requiredNavPermission="heroSlides">
                <AdminLayout>
                  <HeroSlidesListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/hero-slides/new"
            element={
              <ProtectedRoute requiredNavPermission="heroSlides">
                <AdminLayout>
                  <HeroSlideEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/hero-slides/:id"
            element={
              <ProtectedRoute requiredNavPermission="heroSlides">
                <AdminLayout>
                  <HeroSlideViewPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/hero-slides/:id/edit"
            element={
              <ProtectedRoute requiredNavPermission="heroSlides">
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
              <ProtectedRoute requiredRoles={['reviewer', 'admin']} requiredNavPermission="reviewQueue">
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
              <ProtectedRoute requiredRoles={['approver', 'admin']} requiredNavPermission="approvalQueue">
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
              <ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="auditLogs">
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
              <ProtectedRoute requiredNavPermission="mediaLibrary">
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
              <ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="users">
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
              <ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="menuConfig">
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
              <ProtectedRoute requiredNavPermission="teamMembers">
                <AdminLayout>
                  <TeamMembersListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Partners Route */}
          <Route
            path="/admin/partners"
            element={
              <ProtectedRoute requiredNavPermission="partners">
                <AdminLayout>
                  <PartnersListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Impact Stats Route */}
          <Route
            path="/admin/impact-stats"
            element={
              <ProtectedRoute requiredNavPermission="impactStats">
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
              <ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="footerSettings">
                <AdminLayout>
                  <FooterConfigEditor />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* EFPI website editor: preview on the left, its copy on the right */}
          <Route
            path="/admin/efpi"
            element={
              <ProtectedRoute requiredNavPermission="pages">
                <AdminLayout>
                  <EfpiEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Enquiries from the EFPI site's contact, partner and factsheet forms */}
          <Route
            path="/admin/efpi/submissions"
            element={
              <ProtectedRoute requiredNavPermission="pages">
                <AdminLayout>
                  <EfpiSubmissionsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Pages CMS Routes */}
          <Route
            path="/admin/pages"
            element={
              <ProtectedRoute requiredNavPermission="pages">
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
              <ProtectedRoute requiredNavPermission="pages">
                <AdminLayout>
                  <PageEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pages/:slug/sections/new"
            element={
              <ProtectedRoute requiredNavPermission="pages">
                <AdminLayout>
                  <SectionEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pages/:slug/sections/:sectionKey"
            element={
              <ProtectedRoute requiredNavPermission="pages">
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
              <ProtectedRoute requiredNavPermission="campaigns">
                <AdminLayout>
                  <CampaignsListPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/campaigns/new"
            element={
              <ProtectedRoute requiredRoles={['admin']} requiredNavPermission="campaigns">
                <AdminLayout>
                  <CampaignEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/campaigns/:slug"
            element={
              <ProtectedRoute requiredNavPermission="campaigns">
                <AdminLayout>
                  <CampaignEditorPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/campaigns/:slug/edit"
            element={
              <ProtectedRoute requiredRoles={['admin']} requiredNavPermission="campaigns">
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
              <ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="lotteryConfig">
                <AdminLayout>
                  <LotteryConfigPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/lottery/entries"
            element={
              <ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="lotteryEntries">
                <AdminLayout>
                  <LotteryEntriesPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />


          {/* Pledges Route */}
          <Route
            path="/admin/pledges"
            element={
              <ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="pledges">
                <AdminLayout>
                  <PledgesPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Impact Donations Route (Legacy - redirects to new unified page) */}
          <Route
            path="/admin/impact-donations"
            element={
              <ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="donations">
                <AdminLayout>
                  <ImpactDonationsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Unified Donations Route (with tabs for Impact and General) */}
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute requiredRoles={['admin']} requiredAdminPermission="donations">
                <AdminLayout>
                  <DonationsPage />
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
