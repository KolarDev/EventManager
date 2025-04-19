const cron = require('node-cron');

// Background job to run every hour 
cron.schedule('0 * * * *', () => {
  // Call the function to run
});


