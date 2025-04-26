import { Controller, Get, UseGuards, Request, Response } from '@nestjs/common';
import { GoogleOAuthGuard } from './passport/guards/google-oauth/google-oauth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passport/guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class GoogleOAuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google/login')
  async googleOAuth(@Request() req) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  async googleOAuthRedirect(@Request() req, @Response() res) {
    const userInfo = await this.authService.login(req.user)
    res.redirect(`http://localhost:3000/api/auth/google/callback?userId=${userInfo.id}&name=${userInfo.name}&avatar=${userInfo.avatar}&accessToken=${userInfo.accessToken}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  verifyToken() {
    return 'ok'
  }
}
