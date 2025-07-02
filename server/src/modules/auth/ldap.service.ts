import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ldapAttributes } from '../../config/configuration';
import configuration from '../../config/configuration';
import * as ldap from 'ldapjs';
import { UsersService } from '../users/users.service';
import { LdapUser } from './entities/ldap.entity';

@Injectable()
export class LdapService {
  private logger = new Logger('LdapService');
  private readonly client: ldap.Client;
  private readonly baseDn: string;

  constructor(private usersService: UsersService) {
    this.client = ldap.createClient({
      url: configuration().ldapUrl,
    });
    this.baseDn = configuration().baseDn;
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isEmail = regex.test(username);
    const uidValue: string = isEmail ? username.split('@')[0] : username;
    const userDn = `uid=${uidValue},${this.baseDn}`;

    this.logger.log(`Authenticating user with DN: ${userDn}`);

    // validação do LDAP
    return new Promise((resolve, reject) => {
      this.client.bind(userDn, password, (err) => {
        if (err) {
          this.logger.error(
            `Authentication failed for user ${username}: ${err}`,
          );
          reject(new UnauthorizedException('Invalid Credentials'));
        } else {
          this.logger.log(
            `LDAP Authentication successful for user ${username}`,
          );
          resolve(true);
        }
      });
    });
  }

  async CheckUserLdap(uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const searchOptions: ldap.SearchOptions = {
        scope: 'sub',
        filter: `(uid=${uid})`,
        attributes: ldapAttributes,
      };
      const user: any = {};
      this.client.search(this.baseDn, searchOptions, (err, res) => {
        if (err) {
          this.logger.error(`LDAP search failed: ${err}`);
          reject(err);
        } else {
          res.on('searchEntry', (entry) => {
            const attributes = entry.pojo.attributes;
            const attributeMap = {
              givenname: 'firstName',
              uid: 'username',
              mail: 'email',
              sn: 'lastName',
            };

            attributes.forEach((attribute: any) => {
              const key = attribute.type.toLowerCase();
              if (attributeMap.hasOwnProperty(key)) {
                const propName = attributeMap[key];
                user[propName] = attribute.values[0];
              }
            });
          });
          res.on('end', () => {
            if (user.hasOwnProperty('username')) {
              resolve(user);
            } else {
              this.logger.warn(`Authetication failed for ${uid} user`);
              reject(
                new HttpException(
                  'the searched user does not exists in ldap !',
                  401,
                ),
              );
            }
          });
        }
      });
    });
  }

  async findOrCreateUser(username: string) {
    // search for user in LDAP by username
    this.logger.log(`===> checking username in ldap => ${username}`);
    const userFromLdap: LdapUser = await this.CheckUserLdap(username);
    // search for a user in database

    this.logger.log(`===> checking username in database => ${username}`);
    const findUserFromDb = await this.usersService.findOne({ username });

    console.log('chegou aqui');

    if (!findUserFromDb) {
      this.logger.log('===> user does not exist on database');

      this.logger.log(userFromLdap);
      // create new user in the database
      const userFromDb = await this.usersService.createLdapUser({
        username: userFromLdap.username,
        firstName: userFromLdap.firstName,
        lastName: userFromLdap.lastName,
        role: 'USER',
        email: userFromLdap.email,
      });

      this.logger.log('===> user created ==>', userFromDb);

      return userFromDb;
    }

    return findUserFromDb;
  }
}
