import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://staging-fuse-aws.flatirons.com',
    env: {
      apiKey: '56400462-3208-4275-ad8d-6fb530d4e274',
      namespace: '6cxyy',
      testmailApiUrl: 'https://api.testmail.app/api/json'
    }
  }
});
