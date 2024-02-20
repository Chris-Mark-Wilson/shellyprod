import {useEffect,useLayoutEffect,useState,useContext} from 'react';
import { getStatus } from '../shellyApi';
import { getData } from '../phoneApi';
import { StatusBar } from 'expo-status-bar';
import {  StyleSheet, Text, View } from 'react-native';
import { DateContext,PowerContext } from '../Contexts';



export const PowerMeter=({navigation})=> {
  const timerInterval=2000;
  const today=new Date().toDateString();
  const standingCharge=0.477;
  const rate=0.2929;
 
  const [onlineStatus,setOnlineStatus] = useState(false);
  const [time,setTime] = useState(0);
  const [power,setPower] = useState(0);
  const [totalEnergy,setTotalEnergy] = useState(0);
  
  const [daysInUse,setDaysInUse] = useState(0);
  const [totalStandingCharge,setTotalStandingCharge] = useState(0);
  const [totalRate,setTotalRate] = useState(0);
  const [totalCost,setTotalCost] = useState(0);
  const [timer,setTimer] = useState(0);

  const {date,setDate} = useContext(DateContext);
  const {powerMeterId,
        powerMeterServer,
        powerMeterAuth}=useContext(PowerContext)



useLayoutEffect(()=>{
  if (powerMeterId) {
    getStatus(powerMeterId, powerMeterServer, powerMeterAuth)
      .then((response) => {
        console.log(JSON.stringify(response, null, 1), 'response in app.js');
        setOnlineStatus(response.data.online.toString());
        setTime(response.data.device_status.time);
        setPower((response.data.device_status.emeters[0].power / 1000).toFixed(3));
        setTotalEnergy((response.data.device_status.emeters[0].total / 1000).toFixed(3));
        console.log(Object.keys(response.data.device_status), 'keys in app.js');





      })
      .catch((error) => {
        alert('Error in fetching data');
        console.log(error, 'error in app.js');
      })
  }

},[timer,powerMeterId])

  useEffect(() => {
    if (powerMeterId) {
      getData('date')
        .then((response) => {
          if (response !== 'No Data Found') {
            setDate(new Date(response));
          }
        })
        .catch((error) => {
          alert('Error in fetching data');
          console.log(error, 'error in app.js');
        })
    }
  }, [powerMeterId])


useEffect(()=>{
  setDaysInUse(calulateDays(today,date));
},[date])

useEffect(()=>{
  setTotalStandingCharge((standingCharge*daysInUse).toFixed(2));
},[,standingCharge,daysInUse])

useEffect(()=>{
  setTotalRate((rate*totalEnergy).toFixed(2));
},[rate,totalEnergy])

useEffect(()=>{
  setTotalCost((+totalStandingCharge+ +totalRate).toFixed(2));
  },[totalStandingCharge,totalRate])

const calulateDays=(date1,date2)=>{
  const date1MS = new Date(date1).getTime();
  const date2MS = new Date(date2).getTime();
  const difference = date2MS - date1MS;
  const days = Math.abs(difference/(1000*60*60*24));
  //include start date and today in the count
  return Math.ceil(days)+1;
}




useEffect(()=>{
  
  const interval = setInterval(()=>{
   if(onlineStatus=="true") {
    setTimer((prev)=>prev+1);
   }
  },timerInterval);


  return ()=>clearInterval(interval);

},[timer,onlineStatus])


  return (
    <>   
     
     <View style={styles.container}>
        {powerMeterId ?
          <>
            <Text style={styles.text}>Todays date:{today}</Text>
            <Text style={styles.text}>Online Status: {onlineStatus}</Text>
            <Text style={styles.text}>Time data retrieved at: {time}</Text>
            <Text style={styles.text}>Current usage: {power} Kw</Text>
            <Text style={styles.text}>Total Energy: {totalEnergy} Kwh</Text>
            <Text style={styles.text}>{daysInUse} days since start</Text>
            <Text style={styles.text}>Subtotal standing charge: £{totalStandingCharge} </Text>
            <Text style={styles.text}>Subtotal power used: £{totalRate} </Text>
            <Text style={styles.text}>Overall Total Cost: £{totalCost} </Text>
            <StatusBar style="auto" />
          </>
          //if no power meter id
          : <>
            <View style={styles.noData}>
              <Text style={styles.noDataText}>No Meter Selected</Text>
            </View>
          </>}
    </View>
   
      </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop:100,
    
  },
  text:{
    fontSize:20,
  },
  noData:{},
  noDataText:{},
  
});
