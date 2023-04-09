import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Admin, User } from '@prisma/client';

import jwtConfig from '@config/jwt.config';
import { PrismaService } from '@common/prisma';
import { ANONYMOUS_SOCKET_ROOM } from '@app/app.constants';
import gatewayOptions from './gateway.options';

type JwtPayloadData =
  | {
      kind: 'user';
      data: User & { following: User[] };
    }
  | { kind: 'admin'; data: Admin };

@WebSocketGateway(gatewayOptions)
export default class BaseGateway implements OnGatewayConnection {
  @WebSocketServer()
  public server: Server;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public async handleConnection(client: Socket) {
    if (!client.handshake.auth?.token) {
      return client.join(ANONYMOUS_SOCKET_ROOM);
    }

    const user = await this.getUserFromToken(client.handshake.auth.token);

    if (!user) {
      return;
    }

    if (user.kind === 'admin') {
      return client.join('admins');
    }

    user.data.following.forEach((following) => {
      client.join(`followers-of-${following.id}`);
    });

    return client.join(`user-${user.data.id}`);
  }

  private async getUserFromToken(
    tokenQuery: string | string[],
  ): Promise<JwtPayloadData> {
    const token = Array.isArray(tokenQuery) ? tokenQuery[0] : tokenQuery;

    const payload = await this.jwt
      .verifyAsync(token, {
        secret: this.config.access.secret,
        ignoreExpiration: false,
      })
      .catch(() => null);

    if (!payload) {
      return null;
    }

    if (payload.kind === 'admin') {
      const admin = await this.prisma.admin.findFirst({
        where: {
          id: payload.executorId,
        },
      });

      if (!admin) {
        return null;
      }

      return { kind: 'admin', data: admin };
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.executorId,
      },
      include: {
        following: true,
      },
    });

    if (!user) {
      return null;
    }

    return { kind: payload.kind, data: user };
  }
}
