const { Brevo } = require('@getbrevo/brevo');
console.log(Object.keys(new Brevo({ apiKey: "test" })));
