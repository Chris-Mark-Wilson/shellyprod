import React ,{useContext,useState}from 'react';
import { View,Text,StyleSheet,TextInput,Alert, Button} from 'react-native';
import {DatePicker} from '../components/DatePicker';
import { DateContext } from '../Contexts';
import { clearAllDevices } from '../phoneApi';

export const Settings=({navigagtion})=>{
    const {date,setDate} = useContext(DateContext);
    const [inputValue,setInputValue]=useState('')

    const clear=()=>{
        clearAllDevices()
        .then(()=>{
            Alert.alert('Memory cleared','All shelly devices have been removed from this device')
        })
        .catch(error=>Alert.alert('Error',error))
    }

    return(
        <View style={styles.container}>
            <Text>Settings</Text>
            <Button 
            title='Clear memory'
            onPress={clear}/>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setInputValue(text)}
                value={inputValue}
            />
            <View style={{flex:0.4,alignItems:"center",justifyContent:"space-around"}}>
      <DatePicker date={date} setDate={setDate}/>
      </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})