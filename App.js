import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import UnitsPicker from './components/UnitsPicker';

import WeatherInfo from './components/WeatherInfo';

const WEATHER_API_KEY = '6b97b7206070e57917dc9ca3cff5a522';
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?';

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unitsSystem, setUnitsSystem] = useState('metric');

  useEffect(() => {
    load();
  }, [unitsSystem])

  async function load() {
    try {
      let { status } = await Location.requestPermissionsAsync();

      if (status != 'granted') {
        console.log(status);
        setErrorMessage("Çalışması için lokasyona izin verin..");
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;

      console.log(latitude, longitude)

      const weatherUrl =
        `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;




      const response = await fetch(weatherUrl);

      const result = await response.json();


      if (response.ok) {
        setCurrentWeather(result);
        console.log(result)
      } else {
        setErrorMessage(result.message);
        console.log('response içindeki hata ${result.message}')
      }

      console.log(latitude, longitude);
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  if (currentWeather) {
 
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main} >
          <UnitsPicker  unitsSystem= {unitsSystem}  setUnitsSystem= {setUnitsSystem} />
          <WeatherInfo currentWeather={currentWeather} />
        </View>


      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.errorText} >{errorMessage} garip bir hata</Text>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  main: {
    justifyContent: "center",
    flex: 1,
  },
  errorText: {
    textAlign: "center"
  }
});
