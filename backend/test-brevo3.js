const brevo = require('@getbrevo/brevo');
console.log('brevo type:', typeof brevo);
console.log('BrevoClient type:', typeof brevo.BrevoClient);
console.log('BrevoClient properties:', Object.keys(brevo.BrevoClient.prototype || {}));
