import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import type { Config, User } from '../../types';

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'shellui-secret-key',
    })
  )
  .derive(({ store }) => ({
    config: store.config as Config,
  }))
  .post(
    '/login',
    async ({ body, config, jwt, set }) => {
      if (!config.auth?.enabled) {
        return { success: true, user: { username: 'anonymous', roles: ['admin'] } };
      }

      const user = config.auth.users?.find(
        (u) => u.username === body.username && u.password === body.password
      );

      if (!user) {
        set.status = 401;
        return { success: false, message: 'Invalid credentials' };
      }

      const token = await jwt.sign({
        username: user.username,
        roles: user.roles || [],
      });

      return {
        success: true,
        token,
        user: {
          username: user.username,
          roles: user.roles || [],
        },
      };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  )
  .get('/me', () => ({
    authenticated: false,
    user: null,
    message: 'Authentication disabled',
  }))
  .post('/logout', () => ({
    success: true,
    message: 'Logged out (no-op)'
  })); 
