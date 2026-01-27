# Generate Secure JWT Secret

Generate a strong random 32-character JWT secret for production:

## Option 1: Node.js (Recommended)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Option 2: OpenSSL
```bash
openssl rand -hex 32
```

## Option 3: Online Generator
Use a secure random string generator:
- https://randomkeygen.com/ (use "Fort Knox Passwords")

## Usage

Copy the generated string and add it to your Render environment variables:

```
JWT_SECRET=your_generated_32_character_random_string_here
```

⚠️ **IMPORTANT**: 
- Never commit this secret to git
- Use different secrets for development and production
- Keep it secure and never share it
