const Cookie = require('../models/Cookie.js');

const syncCookies = async (req, res) => {
  try {
    const { cookies } = req.body;
    const userId = req.user._id;

    // Delete old cookies for this user
    await Cookie.deleteMany({ userId });

    // Insert new cookies
    const cookieDocs = cookies.map(cookie => ({
      userId,
      ...cookie
    }));

    await Cookie.insertMany(cookieDocs);

    res.json({ success: true, message: `${cookies.length} cookies synced` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserCookies = async (req, res) => {
  try {
    const cookies = await Cookie.find({ userId: req.user._id }).sort({ syncedAt: -1 });
    res.json({ success: true, cookies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { syncCookies, getUserCookies };