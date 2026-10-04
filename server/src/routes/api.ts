import { Router } from 'express';
import {
  submitRegistration,
  getTicketDetails,
  getPublicStats
} from '../controllers/registrationController';
import {
  adminLogin,
  getAdminProfile,
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  getAnalytics,
  exportCsv,
  seedDemoData
} from '../controllers/adminController';
import { verifyAdmin } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/register', submitRegistration);
router.get('/ticket/:ticketCode', getTicketDetails);
router.get('/public-stats', getPublicStats);

// Admin Auth
router.post('/admin/login', adminLogin);

// Protected Admin routes
router.get('/admin/me', verifyAdmin, getAdminProfile);
router.get('/admin/registrations', verifyAdmin, getRegistrations);
router.patch('/admin/registrations/:id/status', verifyAdmin, updateRegistrationStatus);
router.delete('/admin/registrations/:id', verifyAdmin, deleteRegistration);
router.get('/admin/analytics', verifyAdmin, getAnalytics);
router.get('/admin/export', verifyAdmin, exportCsv);
router.post('/admin/seed-demo', verifyAdmin, seedDemoData);

// Health check endpoint for deployment platforms (Render, Railway, Fly, etc.)
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'The Last Commit Backend (Node.js + TypeScript)'
  });
});

export default router;
