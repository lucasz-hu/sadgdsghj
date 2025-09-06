// Utility script to update the geocoding cache
// Run this when you add new addresses to your CSV

import axios from 'axios'
import fs from 'fs'
import path from 'path'

const CACHE_FILE = path.join(__dirname, '../data/geocodingCache.json')

// Load existing cache
let geocodingCache = {}
try {
  const cacheData = fs.readFileSync(CACHE_FILE, 'utf8')
  geocodingCache = JSON.parse(cacheData)
} catch (error) {
  console.log('Creating new cache file...')
}

// Function to geocode an address and add to cache
const geocodeAndCache = async (address, index = 0) => {
  if (!address || address.trim() === '') {
    return null
  }

  // Check if already cached
  if (geocodingCache[address]) {
    console.log(`✓ Already cached: ${address}`)
    return geocodingCache[address]
  }

  // Add delay to respect rate limits
  if (index > 0) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  try {
    console.log(`Geocoding: ${address}`)
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'ElenaDatesApp/1.0'
      }
    })

    if (response.data && response.data.length > 0) {
      const result = response.data[0]
      const geocodedData = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: address,
        display_name: result.display_name
      }
      
      geocodingCache[address] = geocodedData
      console.log(`✓ Cached: ${address} -> [${geocodedData.lat}, ${geocodedData.lng}]`)
      return geocodedData
    } else {
      console.warn(`✗ No results for: ${address}`)
      return null
    }
  } catch (error) {
    console.error(`✗ Failed to geocode: ${address}`, error.message)
    return null
  }
}

// Function to save cache to file
const saveCache = () => {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(geocodingCache, null, 2))
    console.log(`✓ Cache saved to ${CACHE_FILE}`)
  } catch (error) {
    console.error('✗ Failed to save cache:', error.message)
  }
}

// Example usage - add your new addresses here
const newAddresses = [
  // Add new addresses from your CSV here, for example:
  // "123 Main St, Seattle, WA 98101",
  // "456 Oak Ave, Bellevue, WA 98004"
]

// Main function to geocode new addresses
const updateCache = async () => {
  console.log('Starting geocoding cache update...')
  
  for (let i = 0; i < newAddresses.length; i++) {
    await geocodeAndCache(newAddresses[i], i)
  }
  
  saveCache()
  console.log('Cache update complete!')
}

// Export for use in other files
export { geocodeAndCache, saveCache, updateCache }

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateCache()
}
