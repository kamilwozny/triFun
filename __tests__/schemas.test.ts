import { loginAuthSchema, registerAuthSchema } from '@/actions/schemas';

describe('loginAuthSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginAuthSchema.safeParse({ email: 'user@example.com', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('rejects email shorter than 4 characters', () => {
    const result = loginAuthSchema.safeParse({ email: 'a@b', password: 'secret123' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 6 characters', () => {
    const result = loginAuthSchema.safeParse({ email: 'user@example.com', password: '123' });
    expect(result.success).toBe(false);
  });

  it('rejects missing email', () => {
    const result = loginAuthSchema.safeParse({ password: 'secret123' });
    expect(result.success).toBe(false);
  });

  it('rejects missing password', () => {
    const result = loginAuthSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(false);
  });
});

describe('registerAuthSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerAuthSchema.safeParse({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'securepass',
    });
    expect(result.success).toBe(true);
  });

  it('rejects username shorter than 4 characters', () => {
    const result = registerAuthSchema.safeParse({
      username: 'jo',
      email: 'john@example.com',
      password: 'securepass',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const result = registerAuthSchema.safeParse({
      username: 'john_doe',
      email: 'not-an-email',
      password: 'securepass',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 6 characters', () => {
    const result = registerAuthSchema.safeParse({
      username: 'john_doe',
      email: 'john@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = registerAuthSchema.safeParse({ username: 'john_doe' });
    expect(result.success).toBe(false);
  });
});
