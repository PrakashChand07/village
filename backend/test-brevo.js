const brevo = require('@getbrevo/brevo');
console.log(Object.keys(brevo));
console.log("TransactionalEmailsApi in brevo:", 'TransactionalEmailsApi' in brevo);
console.log("default in brevo:", 'default' in brevo);
if (brevo.default) {
    console.log("TransactionalEmailsApi in brevo.default:", 'TransactionalEmailsApi' in brevo.default);
}
