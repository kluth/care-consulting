import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: { email: string; password: string }) {
    // TODO: Implement user validation
    const token = await this.authService.generateToken({ email: loginDto.email });
    return { access_token: token };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() registerDto: { email: string; password: string; name: string }) {
    const hashedPassword = await this.authService.hashPassword(registerDto.password);
    // TODO: Save user to database
    return { message: 'User registered successfully' };
  }
}
