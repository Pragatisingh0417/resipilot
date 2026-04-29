const router = require('express').Router();
const Child = require('../models/Child');
const FosterFamily = require('../models/FosterFamily');
const Case = require('../models/Case');
const auth = require('../middleware/auth');

console.log("✅ Analytics route loaded");

router.get('/dashboard', auth, async (req, res) => {
  try {
    console.log("🔥 DASHBOARD HIT");

    const [totalChildren, totalFamilies, openCases, placedChildren] = await Promise.all([
      Child.countDocuments(),
      FosterFamily.countDocuments({ status: 'active' }),
      Case.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      Child.countDocuments({ status: 'placed' }),
    ]);

    // ✅ Risk Distribution
    const riskDistribution = await Child.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
    ]);

    // ✅ Monthly Placements (FIXED)
    const monthlyPlacementsRaw = await Child.aggregate([
      { $match: { status: "placed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ✅ Convert month number → name
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const monthlyPlacements = monthlyPlacementsRaw.map(item => ({
      month: months[item._id - 1],
      placements: item.count
    }));

    console.log("Children count:", totalChildren);

    res.json({
      totalChildren,
      totalFamilies,
      openCases,
      placedChildren,
      riskDistribution,
      monthlyPlacements, // ✅ ADDED
      placementRate: totalChildren > 0
        ? Math.round((placedChildren / totalChildren) * 100)
        : 0
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;