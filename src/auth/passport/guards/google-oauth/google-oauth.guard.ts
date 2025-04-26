import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    // we specify accessType to be offline so that Google can return a refresh token after successful authentication.
    super({
      accessType: 'offline',
    })
  }
}
