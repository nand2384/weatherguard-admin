const fs = require('fs');
let data = fs.readFileSync('src/data/mockData.ts', 'utf8');
data = data.replace(/createdAt: /g, "telegramConnected: Math.random() > 0.5, alertFrequency: 'Every 3 Hours', requestedAt: ");
fs.writeFileSync('src/data/mockData.ts', data);
