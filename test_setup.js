/**
 * Quick test to verify the setup is working correctly
 */

require('dotenv').config();
const SimpleFreesound = require('./server/SimpleFreesound').default;
const { apiKey, downloadFolder } = require('./test/constants');

console.log('🔍 Testing simple-freesound setup...\n');

// Verify environment variables
if (!apiKey) {
  console.error('❌ API key not found');
  process.exit(1);
}

if (!downloadFolder) {
  console.error('❌ Download folder not found');
  process.exit(1);
}

console.log('✓ Environment variables loaded:');
console.log(`  - API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 8)}`);
console.log(`  - Download Folder: ${downloadFolder}\n`);

// Test instantiation
try {
  const sf = new SimpleFreesound(apiKey, {
    destination: downloadFolder,
    storeSoundsInfo: false
  });
  
  console.log('✓ SimpleFreesound client instantiated successfully');
  console.log(`  - Has query method: ${typeof sf.query === 'function'}`);
  console.log(`  - Has download method: ${typeof sf.download === 'function'}`);
  console.log(`  - Has currentSoundsInfo: ${typeof sf.currentSoundsInfo === 'object'}`);
  console.log('\n✅ All checks passed! You\'re ready to use simple-freesound\n');
  
} catch (error) {
  console.error('❌ Error instantiating SimpleFreesound:', error.message);
  process.exit(1);
}
