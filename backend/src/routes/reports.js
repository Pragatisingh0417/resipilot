const router = require('express').Router();
const auth = require('../middleware/auth');

const reports = [
  { id: '1', name: 'Monthly Placement Report', type: 'Placement', generated: '2024-01-15', status: 'Ready' },
  { id: '2', name: 'Risk Assessment Summary', type: 'Risk', generated: '2024-01-14', status: 'Ready' },
  { id: '3', name: 'Case Worker Performance', type: 'Performance', generated: '2024-01-13', status: 'Ready' },
  { id: '4', name: 'Quarterly Compliance Report', type: 'Compliance', generated: '2024-01-10', status: 'Ready' },
];

router.get('/', auth, (req, res) => res.json(reports));
router.post('/generate', auth, (req, res) => {
  res.json({ message: 'Report generation started', reportId: Date.now().toString() });
});

module.exports = router;
