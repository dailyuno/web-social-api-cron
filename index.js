const cron = require('node-cron');
const App = require('./js/App.js');

const app = new App();

cron.schedule('0 0 * * * *', () => {
    app.init();
});