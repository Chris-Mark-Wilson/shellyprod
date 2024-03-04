import React,{useState,useRef} from "react"
import {View,Text,StyleSheet,TextInput,Alert,Pressable} from 'react-native'
import { testUrl, } from "../shellyApi"
import { getData,storeData } from "../phoneApi"


export const AddDevice=({navigation})=>{
    //remove these hardcoded values for build
    const [deviceName,setDeviceName]=useState(null)
    const [deviceId,setDeviceId]=useState('244cab417976')
    const [serverUrl,setServerUrl]=useState('https://shelly-xx-eu.shelly.cloud')
    const [authKey,setAuthKey]=useState('')
    const deviceNameRef=useRef(null)
    const IdRef=useRef(null)
    const urlRef=useRef(null)
    const authKeyRef=useRef(null)

    const validateDeviceName=(e)=>{
        const name=e.nativeEvent.text
        const regex=/[^a-zA-Z\s]/gi;
       
        if(name.match(regex)){
            Alert.alert('Device must be named','Please enter a name for the device, character A-z only. Upper and lower case are allowed along with spaces',[{text:'Ok',onPress:()=>deviceNameRef.current.focus()}])
        }
    }

const validateDeviceId=(e)=>{
    const id=e.nativeEvent.text
    if(id.length!=12){
        Alert.alert('Incorrect Id length','Shelly id must be 12 characters in length',[{text:'Ok',onPress:()=>IdRef.current.focus()}])
    }
}

const validateServerUrl = (e) => {
  const url = e.nativeEvent.text;
//   console.log(url.slice(0, 6));
  if (!url.endsWith(".shelly.cloud") || url.slice(0, 14) !== "https://shelly") {
    Alert.alert(
      "Invalid url",
      'url must begin with "https://shelly" and end with ".shelly.cloud"',
      [{ text: "Ok", onPress: () => urlRef.current.focus() }]
    );
  }
};

const validateAuthKey=(e)=>{
    const key=e.nativeEvent.text;
    // console.log(key.length)
    if(key.length!=92){
        Alert.alert('Invalid Auth Key','Check accurate copy / paste / manual entry. Auth key must be 92 characters',[{text:'Ok', onPress:()=>authKeyRef.current.focus()}]);
    }

}

const submit=()=>{
    if(!deviceName || !deviceId || !serverUrl || !authKey){
        Alert.alert('Incomplete data','Please ensure all fields are completed')

    } else validateSubmit()
    .then(device_type=>{
        // console.log('back in submit')
        if(device_type)
        {
            // console.log(device_type,'isValid in submit (Add Device)')
            return getData('devices')
            .then(devices=>{
                // console.log(devices,'devices before stringify')
               
             
                const start_date=new Date
                // console.log(start_date,'start date')
            return storeData('devices',{...devices,[deviceName.toString()]:{id:deviceId.toString(),serverUrl:serverUrl.toString(),authKey:authKey.toString(),device_type:device_type,start_date:start_date}})
            })
            .then(response=>{
                // console.log(response)
                if(response){
                    Alert.alert('Device added','Device has been added to the device list',[{text:'Add another device',onPress:()=>{setAuthKey(()=>'')
                    setDeviceId(()=>'')
                    setDeviceName(()=>'')
                    setServerUrl(()=>'')}},
                {text:'Go to Devices',onPress:()=>{
                    navigation.navigate('Devices')
                }}])
                }
            })
        }
    })
        .catch(error => {
          
            if (error.status) {
                // console.log(error.status, 'back in submit catch block')
                // console.log(JSON.stringify(error,null,2))
                // console.log(error.data.errors, typeof (error.data.errors))
                const errorKeyArray = Object.keys(error.data.errors)
                const errorArray = Object.values(error.data.errors)
                let errorString = ''
                errorKeyArray.forEach((errorKey, index) => {
                    errorString += `${errorKey}: ${errorArray[index]}\n`
                })

                Alert.alert(`Error:${error.status.toString()}`, errorString, [{ text: 'Edit' }, {
                    text: 'Clear', onPress: () => {
                        setAuthKey(() => '')
                        setDeviceId(() => '')
                        setDeviceName(() => '')
                        setServerUrl(() => '')
                    }
                }])
            } else {
            Alert.alert(`Error`, error, [{ text: 'Edit' }, {
                text: 'Clear', onPress: () => {
                    setAuthKey(() => '')
                    setDeviceId(() => '')
                    setDeviceName(() => '')
                    setServerUrl(() => '')
                    }
                }])
            }
        })
    

}
//prevent resubmission while testUrl is running. show cancel button
const validateSubmit=()=>{
console.log('submitting')
    const url=`${serverUrl}/device/status/?id=${deviceId}&auth_key=${authKey}`
        return testUrl(url)
        .then(response=>{
            // console.log(response)
        if(response.isok==true){
            //device exists in cloud
            // console.log('device exists in cloud validateSubmit (Add Device)')
            return response.data.device_status
        } else {
            return Promise.reject('Device not registered in cloud')
        }
        })
        .then((device_status)=>{
            //check if device name exists
            return Promise.all([getData('devices'),device_status])
        })
        .then(([devices,device_status])=>{
            if(!devices || !devices[deviceName]){
                for(let device in devices){
                    if(devices[device].id===deviceId){
                        return Promise.reject(`Device with this Id already exists under another name: "${device}"`)
                    }
                }
                //device name not found, nor device with same id
                let device_type
                if(device_status.emeters)  {
                    device_type='Power meter'
                } else {
                    //add more checks as device types come back from api
                    device_type='Unknown'
                }
                  //passed all validation checks?
         
                return device_type;
                
            } else {
            return Promise.reject('Device name already exists')
            }
        })
        
}


    return (
        <View style={styles.container}>
        <Text style={styles.header}>Add device</Text>

            <View style={styles.inputFieldView}>

                <View style={styles.block}>
                    <Text style={styles.help}>
                    A recognisable name for the device, e.g. power meter / room thermostat. 12 Characters max
                    </Text>
                        <TextInput
                        ref={deviceNameRef}
                        style={styles.inputFeild}
                        value={deviceName}
                        onChangeText={(text)=>{setDeviceName(text)}}
                        placeholder="Enter a name for the device"
                        maxLength={12}
                        onSubmitEditing={(e)=>{validateDeviceName(e)}}
                        />
                </View>
                
                <View style={styles.block}>
                    <Text style={styles.help}>
                    Device id from shelly app, e.g. 321xyz123456
                    </Text>
                        <TextInput
                        ref={IdRef}
                        style={styles.inputFeild}
                        value={deviceId}
                        onChangeText={(text)=>{setDeviceId(text)}}
                        placeholder="Enter/Paste Device Id"
                        maxLength={12}
                        onSubmitEditing={(e)=>{validateDeviceId(e)}}
                        />
                </View>

                <View style={styles.block}>
                    <Text style={styles.help}>
                    Server base url e.g. shelly-94-eu.shelly.cloud
                    </Text>
                    <Text style={styles.help}>
                        Obtained when you generate auth key in app
                    </Text>
                        <TextInput
                        ref={urlRef}
                        style={styles.inputFeild}
                        value={serverUrl}
                        onChangeText={(text)=>{setServerUrl(text.toLowerCase())}}
                        placeholder="Enter Server Url (copy not available in shelly app)"
                        onSubmitEditing={(e)=>{validateServerUrl(e)}}
                        />
                </View>

                <View style={styles.block}>
                    <Text style={styles.help}>
                    Authorisation key, generated in shelly app
                    </Text>
                        <TextInput
                        ref={authKeyRef}
                        style={styles.inputFeild}
                        value={authKey}
                        onChangeText={(text)=>setAuthKey(text)}
                        placeholder="Enter/Paste Auth Key"
                        // multiline={true}
                        onSubmitEditing={(e)=>{validateAuthKey(e)}}
                        />
                </View>

                <Pressable 
                onPress={submit}>
                    <Text style={styles.submitButton} >
                        Register Device
                    </Text>
                </Pressable>

            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"flex-start",
        alignItems:"center",
     
        
    },
    header:{
        marginTop:30,
        fontSize:30,
        borderWidth:1,
        paddingLeft:10,
        paddingRight:10,
        borderRadius:10,
        backgroundColor:'lightgrey'
    },
    inputFieldView:{
        height:450,
        padding:20,
        marginTop:20,
        justifyContent:"space-around",
        alignItems:'center',
        
       

    },
    block:{
        // borderWidth:1,
        // borderColor:'blue'
    },
    help:{
        // borderWidth:1,
        // borderColor:'red'
    },
    inputFeild:{
        height:30,
        borderWidth:1,
        borderRadius:3,
        paddingTop:0,
        paddingLeft:10,
        backgroundColor:'lightgrey',
        color:'black',
        fontWeight:'bold'
    },
    submitButton:{
        marginTop:20,
        marginBottom:10,
        fontSize:20,
        backgroundColor:'lightblue',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:2,
        paddingBottom:2,
        borderWidth:1,
        borderRadius:5


    }
})