import {useState} from "react"

function App() {
  const API_KEY= "df0d0d7c-920b-48c9-96a7-7510be443a02" 
  const [art, setArt] = useState(null)
  const [banList, setBanList] = useState([])

  const fetchArt = async () => {
  
    const response = await fetch(
      `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&size=20`
    )
    
    const data = await response.json()

    let validArt = null 
    let attempts = 0

    while (!validArt && attempts < 20){
       const randomIndex = Math.floor(Math.random() * data.records.length)
       const candidate = data.records[randomIndex]

       const artist = candidate.people?.[0]?.name
       const culture = candidate.culture
       const year = candidate.dated

       if ( 
         candidate.primaryimageurl &&
         !banList.includes(artist) &&
         !banList.includes(culture) &&
         !banList.includes(year)
      ) {
        validArt = candidate
      }
        attempts++
      }
     if (!validArt) {
      validArt = data.records[0]
     }
    setArt (validArt)
  }

  const toggleBan = (value) => {
      if (!value) return

      if(banList.includes(value)) {
        setBanList(banList.filter(item => item !== value))
      } else {
        setBanList ([...banList, value])
      }
    }

  return (
    <div style={{ textAlign: "center", padding: "20px"}}>
      <h1>Wabbittz Discovery </h1>


      <button onClick={fetchArt}>
       Discover Luxury Art
        </button>
        
        <div>
          <h4> Ban List</h4>
          {banList.map((item, index) => (
            <span 
              key={index}
              onClick={() => toggleBan(item)}
              style={{
                margin: "20px",
                padding: "5px",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              {item}
            </span>
          ))}
        </div>

      {art && (
        <div>
          {art.primaryimageurl && ( 
            <img 
            src={art.primaryimageurl || 
            "https://via.placeholder.com/300?text=No+Image"
            } 
            alt="art" 
            width="300"
            />
          )}

        <p onClick={() => toggleBan(art.people?.[0]?.name)}>
            Artist: {art.people?.[0]?.name || "Unknown"}
        </p>
       
        <p onClick={() => toggleBan(art.culture)}>
            Culture: {art.culture || "Unknown"} 
        </p>
        
        <p onClick={() => toggleBan(art.dated)}>
            Year: {art.dated || "Unknown"}
        </p>
        </div>
        )}
    </div>
  
  )
}

export default App