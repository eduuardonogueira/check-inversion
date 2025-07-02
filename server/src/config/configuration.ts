export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'some_string',
  ldapUrl: process.env.LDAP_ENDPOINT,
  baseDn: process.env.LDAP_USER_SEARCH_BASE,
});

export const ldapAttributes = ['cn', 'sn', 'mail', 'uid', 'givenname'];
