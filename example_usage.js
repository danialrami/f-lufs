/**
 * Example usage of simple-freesound library
 * 
 * This script demonstrates how to:
 * 1. Query sounds from Freesound API
 * 2. Download the HQ MP3 previews
 * 3. Access sound metadata
 */

require('dotenv').config();
const SimpleFreesound = require('./server/SimpleFreesound').default;
const { apiKey, downloadFolder } = require('./test/constants');

// Initialize the Freesound client
const sf = new SimpleFreesound(apiKey, {
  destination: downloadFolder,
  storeSoundsInfo: false  // Set to true to cache all results
});

async function main() {
  try {
    console.log('🔍 Searching for sounds...\n');
    
    // Example 1: Query sounds with specific parameters
    await sf.query({
      search: ['ambient', 'pad'],
      duration: [2, 10],  // Between 2-10 seconds
    });
    
    console.log(`✓ Found ${Object.keys(sf.currentSoundsInfo).length} sounds\n`);
    
    // Display first few results
    const sounds = Object.values(sf.currentSoundsInfo).slice(0, 3);
    sounds.forEach((sound, i) => {
      console.log(`${i + 1}. ${sound.name}`);
      console.log(`   ID: ${sound.id}, Duration: ${sound.duration}s`);
      console.log(`   By: ${sound.username}\n`);
    });
    
    // Example 2: Download the sounds
    console.log('⬇️  Downloading sounds...\n');
    await sf.download();
    
    console.log('✓ Download complete!\n');
    
    // Display download info
    const downloadedSounds = Object.values(sf.currentSoundsInfo);
    downloadedSounds.forEach((sound, i) => {
      if (sound.localUrl) {
        console.log(`✓ ${sound.name}`);
        console.log(`  Saved to: ${sound.localUrl}`);
      }
    });
    
    // Example 3: Save metadata to file
    console.log('\n💾 Saving metadata to file...');
    sf.writeToFile('downloaded_sounds.json');
    console.log('✓ Saved to: downloaded_sounds.json\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the example
main();
