import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  it('should be defined', () => {
    const configService = {
      get: () => 'test_secret',
    } as unknown as ConfigService;
    expect(new JwtStrategy(configService)).toBeDefined();
  });
});
