require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  CivicFix Server running on port ${PORT}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Citizen Registration: http://localhost:${PORT}/register`);
  console.log(`  Citizen Login: http://localhost:${PORT}/login`);
  console.log(`=========================================`);
});
