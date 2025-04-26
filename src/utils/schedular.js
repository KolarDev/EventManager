const cron = require('node-cron');

// Background job to run every hour 
cron.schedule('*/1 * * * * *', () => {
  // console.log('Hello World');
});




