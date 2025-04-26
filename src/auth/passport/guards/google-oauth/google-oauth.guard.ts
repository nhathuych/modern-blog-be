import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor() {
    // we specify accessType to be offline so that Google can return a refresh token after successful authentication.
    super({
      accessType: 'offline',
    })
  }
}
