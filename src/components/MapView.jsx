import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Function to parse CSV data
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    data.push(row)
  }
  
  return data
}

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function MapView() {
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const response = await fetch('/elena.csv')
        if (!response.ok) {
          throw new Error('Failed to fetch CSV data')
        }
        const csvText = await response.text()
        const parsedDates = parseCSV(csvText)
        setDates(parsedDates)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchCSVData()
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading map data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error loading map data: {error}</p>
          <p className="text-gray-600">Please check if the CSV file exists</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
            🗺️ Our Dates Map
          </h1>
          <p className="text-sm sm:text-base text-gray-600 text-center mt-1">
            Explore all the places we've been together
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-full pt-20">
        <div className="h-full w-full relative">
          <MapContainer
            center={[47.6205, -122.3493]} // Seattle Space Needle coordinates
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Date Location Markers */}
            {dates.map((date, index) => {
              if (!date.Location || date.Location.trim() === '') return null

              // Use coordinates from CSV, fallback to Space Needle if not available
              let coordinates = [47.6205, -122.3493] // Space Needle as default
              
              if (date.Latitude && date.Longitude) {
                const lat = parseFloat(date.Latitude)
                const lng = parseFloat(date.Longitude)
                if (!isNaN(lat) && !isNaN(lng)) {
                  coordinates = [lat, lng]
                }
              }

              return (
                <Marker key={index} position={coordinates}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        📍 {date.Location}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Date: {date.Date}
                      </p>
                      {date.Address && (
                        <p className="text-sm text-gray-500 mb-2">
                          📍 {date.Address}
                        </p>
                      )}
                      {date.Notes && (
                        <p className="text-sm text-gray-500 italic">
                          {date.Notes}
                        </p>
                      )}
                      <div className="text-xs text-gray-400 mt-2">
                        Date #{index + 1}
                      </div>
                      {coordinates[0] !== 47.6205 && coordinates[1] !== -122.3493 && (
                        <div className="text-xs text-gray-400 mt-1">
                          📍 {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      </div>

    </div>
  )
}

export default MapView
