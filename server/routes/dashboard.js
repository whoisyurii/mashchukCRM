import express from 'express';
import { companies } from '../data/companies.js';
import { users } from '../data/users.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const totalUsers = users.length;
    const totalCompanies = companies.length;
    const activeCompanies = companies.filter(c => c.status === 'Active').length;
    const totalCapital = companies.reduce((sum, company) => sum + company.capital, 0);

    res.json({
      totalUsers,
      totalCompanies,
      activeCompanies,
      totalCapital,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;