export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3001,
  jwtSecret:
    process.env.JWT_SECRET ||
    'ni2e90q2he1h2ndidhndaiwbibiocnIOb28b8b#$162813123',
  ldapUrl: process.env.LDAP_ENDPOINT,
  baseDn: process.env.LDAP_USER_SEARCH_BASE,
  ldapAttributes: process.env.LDAP_ATTRIBUTES.split(',') || [
    'cn',
    'sn',
    'mail',
    'uid',
    'givenname',
  ],
});
