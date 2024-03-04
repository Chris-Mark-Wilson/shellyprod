import { createContext,useState } from "react";

export const DateContext = createContext();
export const DateProvider = ({children}) =>{
    const [date,setDate] = useState(new Date());
    return(
        <DateContext.Provider value={{date,setDate}}>
            {children}
        </DateContext.Provider>
    )
}

export const PowerContext=createContext()
export const PowerProvider=({children})=>{
    const [powerMeterId,setPowerMeterId]=useState(null)
    const [powerMeterServer,setPowerMeterServer]=useState(null)
    const [powerMeterAuth,setPowerMeterAuth]=useState(null)
    const [powerMeterStartDate,setPowerMeterStartDate]=useState(null)
    return (
            <PowerContext.Provider value={{
                powerMeterId,setPowerMeterId,
                powerMeterServer,setPowerMeterServer,
                powerMeterAuth,setPowerMeterAuth,
                powerMeterStartDate,setPowerMeterStartDate}}>
                {children}
                </PowerContext.Provider>
    )
}

export const GeoLocationContext = createContext();
export const GeoLocationProvider = ({ children }) => {
  const [geoFence, setGeoFence] = useState({
    location:{
    latitude: 0,
    longitude: 0},
    radius: 0,
    status:null
  });

  return (
    <GeoLocationContext.Provider
      value={{
        geoFence,
        setGeoFence,
      }}
    >
      {children}
    </GeoLocationContext.Provider>
  );
};
    
