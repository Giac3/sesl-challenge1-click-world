import { useEffect, useState } from 'react'
import Globe from 'react-globe.gl';
import earth from '../public/earthh.jpeg'
import getUserCountry from "js-user-country";
import Countries from 'central-cities'
function App() {
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [places, setPlaces] = useState([])
  const [currentCity, setCurrentCity] = useState<string>()
  const [allCities, setAllCities] = useState([])
  const [cityNotFound, setCityNotFound] = useState(false)
  const countries = new Countries()

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/all")
      const data = await res.json()
      setCount(data[0].count)
      const res2 = await fetch("/allcities")
      const data2 = await res2.json()
      setAllCities(data2)
    }
    getData()
  }, [])
  
  useEffect(() => {

    let country = getUserCountry().name

    let split = country.split(" ")

    for (let i =0; i<split.length; i++) {
      split[i] = split[i][0].toUpperCase() + split[i].substring(1)
    }
    country = split.join(" ")
    
    const location = countries.byName(country)
    if(location.countries.length > 0) {
      setCurrentCity(location.countries[0].city)
    } else {
      setCityNotFound(true)
    }

    fetch('./ne_110m_populated_places_simple.geojson').then(res => res.json())
      .then(({ features }) => setPlaces(features));
      setLoading(false)
  }, []);

  const handleClick = async () => {
    setLoading(true)
    const res = await fetch("/all", {
      method: "PUT"
    })
    const newtodo = await fetch("/single", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({"city": currentCity})})
      const data = await newtodo.json()
      setCount(count+1)
      setAllCities(prev => {
        let copy = [...prev]
        copy.forEach((item:any) => {
          if (item.city === currentCity) {
            item.count+=1
          }
        })
        return copy
      })
      setLoading(false)
  }

  return (
    <div className="bg-gray-200 gap-2 fixed w-screen h-screen flex items-center justify-center flex-col">
     <h1 className='text-4xl font-bold'>Total</h1>
     <h2 className='text-4xl font-bold'>{count}</h2>
     <button disabled={loading} className='bg-green-200 rounded-md shadow-md p-1 duration-150 hover:bg-green-100 active:bg-green-200 text-2xl' onClick={handleClick}>Add One</button>
     <Globe 
     width={400} 
     height={400}
     backgroundColor='#E5E7EB'
     globeImageUrl={"//unpkg.com/three-globe/example/img/earth-night.jpg"}
     labelsData={places}
      labelLat={(d:any) => d.properties.latitude}
      labelLng={(d:any) => d.properties.longitude}
      labelText={(d:any) => {
        let temp = "0"
        allCities.forEach((item:any) => {
          if (item.city.toLowerCase() === d.properties.name.toLowerCase()) {
            temp = `${item.count}`
          } else {
            temp = "0"
          }
        })
        return temp
      }}
      labelSize={(d:any) => Math.sqrt(d.properties.pop_max) * 4e-4}
      labelDotRadius={(d:any) => Math.sqrt(d.properties.pop_max) * 4e-4}
      labelColor={() => 'rgba(255, 165, 0, 0.75)'}
      labelResolution={2}
     />
     <h3>Hello There, You are clicking from {getUserCountry().name}</h3>

     {
      cityNotFound? <h4>Sorry we could not find your capital</h4> : <h4>This web app will add clicks to your capital city which is, {currentCity}</h4>
     }
    </div>
  )
}

export default App
