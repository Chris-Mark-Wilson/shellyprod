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
    return (
            <PowerContext.Provider value={{
                powerMeterId,setPowerMeterId,
                powerMeterServer,setPowerMeterServer,
                powerMeterAuth,setPowerMeterAuth}}>
                {children}
                </PowerContext.Provider>
    )
}