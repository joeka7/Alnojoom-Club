/**
 * Sends one test enquiry through the real mail path, so credentials can be
 * checked without going through the browser and Turnstile.
 *
 *   node scripts/test-email.mjs
 */
process.loadEnvFile(new URL('../.env', import.meta.url).pathname)

const { isConfigured, verifyConnection, sendEnquiry } = await import('../server/mailer.js')

if (!isConfigured()) {
  console.error('✗ Mail is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS and CONTACT_RECEIVER_EMAIL in .env')
  process.exit(1)
}

console.log('Verifying SMTP credentials…')
const check = await verifyConnection()
if (!check.ok) {
  console.error(`✗ SMTP check failed: ${check.error}`)
  console.error('\nIf this says "Username and Password not accepted", the password is')
  console.error('probably the account password rather than a 16-character App Password.')
  process.exit(1)
}
console.log('✓ Credentials accepted')

console.log('Sending a test enquiry…')
await sendEnquiry({
  name: 'Test Submission',
  email: 'test@example.com',
  dial: '+971',
  phone: '50 123 4567',
  country: 'AE',
  message: 'This is a test message sent by scripts/test-email.mjs to confirm the contact form can deliver mail.',
})
console.log(`✓ Sent to ${process.env.CONTACT_RECEIVER_EMAIL} — check the inbox (and spam).`)
