import { useState, useEffect } from 'react'

// Function to parse CSV data
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',')
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const row = {}
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : ''
    })
    data.push(row)
  }
  
  return data
}

function DatesList() {
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
      <div className="h-screen w-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your beautiful memories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error loading dates: {error}</p>
          <p className="text-gray-600">Please check if the CSV file exists</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-pink-50 to-purple-50 overflow-y-auto">
      <div className="w-full px-3 sm:px-4 py-4 sm:py-6">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
            💕 Our Dates with Elena 💕
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            A beautiful journey of memories together
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-3 sm:gap-4 md:gap-6">
            {dates.map((date, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-6 border-l-4 border-pink-400"
              >
                <div className="flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-xl sm:text-2xl font-bold text-pink-600 mb-1 sm:mb-0 sm:mr-3">
                        {date.Date}
                      </span>
                      {date.Location && (
                        <span className="text-base sm:text-lg font-semibold text-gray-800">
                          {date.Location}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="inline-block bg-pink-100 text-pink-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        Date #{index + 1}
                      </span>
                    </div>
                  </div>
                  {date.Notes && (
                    <p className="text-sm sm:text-base text-gray-600 italic">
                      {date.Notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
                🎉 Total Dates: {dates.length}
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                And many more beautiful memories to come! 💖
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatesList
