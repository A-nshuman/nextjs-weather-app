'use client';
import './globals.css'
import Head from "next/head";

import Navbar from "../components/Navbar";
import Container from "../components/Container";
import WeatherIcon from "../components/WeatherIcon";

import axios from "axios";
import { useQuery } from 'react-query'
import { format, fromUnixTime, parseISO } from "date-fns";

import { Divider, Link } from '@mui/material';
import { FiSunrise } from "react-icons/fi";
import { FiSunset } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { FiWind } from "react-icons/fi";
import { SlSpeedometer } from "react-icons/sl";
import { TbDroplet } from "react-icons/tb";

import { getDayOrNight } from "../utils/getDayOrNight";
import { convertKelvinToCelsius } from "../utils/convertKelvin";
import { placeAtom, loadingCityAtom } from "./atom";
import { useAtom } from 'jotai';
import { useEffect } from 'react';

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: City;
}

interface ForecastItem {
  dt: number; // Unix timestamp for the forecast time
  main: MainData;
  weather: Weather[];
  clouds: { all: number };
  wind: Wind;
  visibility: number;
  pop: number; // Probability of precipitation
  sys: { pod: string };
  dt_txt: string; // Textual representation of the forecast time (e.g., "2024-05-08 21:00:00")
}

interface MainData {
  temp: number; // Temperature (Kelvin)
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Weather {
  id: number;
  main: string; // Weather condition (e.g., "Clear", "Clouds")
  description: string;
  icon: string;
}

interface Wind {
  speed: number;
  deg: number; // Wind direction in degrees
  gust: number;
}

interface City {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  country: string;
  population: number;
  timezone: number;
  sunrise: number; // Unix timestamp for sunrise
  sunset: number; // Unix timestamp for sunset
}

export default function Home() {

  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>("repoData", async () => {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`);
    return data;
  });


  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstDate = data?.list[0];

  // Loading Functionality
  if (isLoading) return (
    <div className="flex flex-row gap-4 justify-center items-center min-h-screen">
      <span className="loading loading-dots loading-lg"></span>
      <p className="text-primary text-[50px]">Loading</p>
    </div>
  );

  // Styles
  const cardClass = "flex flex-col gap-1 items-center justify-evenly rounded bg-secondary border-[1px] border-gray-600 w-[100px] min-[960px]:h-[145px] max-[500px]:text-[10px] max-[500px]:w-[70px]";
  const innerCard = "flex flex-row gap-1 items-center justify-center min-[960px]:flex-col min-[960px]:pt-2"
  const spanStyle = "text-[10px] opacity-80";
  const smallExtraStyle = "text-[10px] flex flex-row items-center justify-start gap-1 rounded border-[1px] border-primary px-[2px] bg-secondary min-w-[52.75px]";

  // Extra Readings
  const sunRise = format(fromUnixTime(data?.city.sunrise ?? 0), 'h:mm');
  const sunSet = format(fromUnixTime(data?.city.sunset ?? 0), 'h:mm');
  const humidity = firstDate?.main.humidity;
  const wind = firstDate?.wind.speed;

  return (

    <>

      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Weather App</title>
      </Head>

      <div className="flex flex-col gap-4 min-h-screen">

        <Navbar location={data?.city.name || ''} />

        <main className="flex flex-col gap-5 max-w-7xl w-full mx-auto p-4 text-primary relative">
          {loadingCity ? <WeatherSkeleton /> :
            <>
              {/* Today */}
              <Container className="today flex-col px-5">

                <h1 className="text-2xl"> {format(parseISO(firstDate?.dt_txt ?? ""), "EEEE")} </h1>
                <p className="text-[12px] opacity-80"> {format(parseISO(firstDate?.dt_txt ?? ""), "dd/MM/yyyy")} </p>

                <div className="my-2 flex gap-5 items-center">

                  {/* Main Card */}
                  <div className="flex flex-row gap-1 p-3 relative bg-background border-[1px] border-gray-600 rounded h-[200px] w-full items-center justify-evenly">

                    {/* Temperature */}
                    <div className="flex flex-col gap-1 p-3 items-center justify-evenly h-full min-w-[145.5px] ">
                      {/* <img className="absolute blur-sm" src={`https://openweathermap.org/img/wn/${firstDate?.weather[0].icon ?? ''}@4x.png`} /> */}
                      <h2 className="text-5xl text-center z-20">{convertKelvinToCelsius(firstDate?.main.temp ?? 296.37)}°C</h2>
                      <h3 className="z-20 text-sm">Feels like: {convertKelvinToCelsius(firstDate?.main.feels_like ?? 296.37)}°C</h3>

                      <div className="max-min flex flex-row items-center justify-center gap-4 z-20">
                        <div className="max flex flex-col items-center justify-center gap-0">
                          <p className="max-min-para flex items-center justify-center">{convertKelvinToCelsius(firstDate?.main.temp_max ?? 296.37)}
                            <span className="text-[4px]">Celcius</span>
                          </p>
                          <p className="text-[10px]">Max &uarr;</p>
                        </div>
                        <Divider />
                        <div className="min flex flex-col items-center justify-center gap-0">
                          <p className="max-min-para flex items-center justify-center">{convertKelvinToCelsius(firstDate?.main.temp_min ?? 296.37)}
                            <span className="text-[4px]">Celcius</span>
                          </p>
                          <p className="text-[10px]">Min &darr;</p>
                        </div>
                      </div>

                      <div className="extraData hidden flex-row gap-1 max-[500px]:flex">
                        <div className={smallExtraStyle}>
                          <FiSunrise />
                          <p className='flex flex-row'>{sunRise} <span className='text-[5px] opacity-80 translate-y-[6.5px]'>AM</span></p>
                        </div>
                        <div className={smallExtraStyle}>
                          <FiSunset />
                          <p className='flex flex-row'>{sunSet} <span className='text-[5px] opacity-80 translate-y-[6.5px]'>PM</span></p>
                        </div>
                      </div>

                      <div className="extraData hidden flex-row gap-1 max-[500px]:flex">
                        <div className={smallExtraStyle}>
                          <TbDroplet />
                          <p className='flex flex-row'>{humidity} <span className='text-[5px] opacity-80 translate-y-[6.5px]'>%</span></p>
                        </div>
                        <div className={smallExtraStyle}>
                          <FiWind />
                          <p className='flex flex-row'>{wind} <span className='text-[5px] opacity-80 translate-y-[6.5px]'>km/h</span></p>
                        </div>
                      </div>

                    </div>

                    {/* Extra */}
                    <div className="flex flex-row items-center justify-center flex-wrap p-2 gap-4 max-[640px]:gap-2 max-[500px]:hidden">

                      <div className={cardClass}>
                        <div className={innerCard}>
                          <FiEye className='min-[960px]:text-2xl' />
                          <p>Visibility</p>
                        </div>
                        <p>{(firstDate?.visibility ?? 0) / 1000} <span className={spanStyle}>km</span></p>
                      </div>

                      <div className={cardClass}>
                        <div className={innerCard}>
                          <TbDroplet className='min-[960px]:text-2xl' />
                          <p>Humidity</p>
                        </div>
                        <p>{humidity} <span className={spanStyle}>%</span></p>
                      </div>

                      <div className={cardClass}>
                        <div className={innerCard}>
                          <FiWind className='min-[960px]:text-2xl' />
                          <p>Wind</p>
                        </div>
                        <p>{firstDate?.wind.speed} <span className={spanStyle}>km/h</span></p>
                      </div>

                      <div className={cardClass}>
                        <div className={innerCard}>
                          <SlSpeedometer className='min-[960px]:text-2xl' />
                          <p>Pressure</p>
                        </div>
                        <p>{firstDate?.main.pressure} <span className={spanStyle}>hPa</span></p>
                      </div>

                      <div className={cardClass}>
                        <div className={innerCard}>
                          <FiSunrise className='min-[960px]:text-2xl' />
                          <p>Sunrise</p>
                        </div>
                        <p>{sunRise} <span className={spanStyle}>AM</span></p>
                      </div>

                      <div className={cardClass}>
                        <div className={innerCard}>
                          <FiSunset className='min-[960px]:text-2xl' />
                          <p>Sunset</p>
                        </div>
                        <p>{sunSet} <span className={spanStyle}>PM</span></p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Weather */}
                <div className="weather flex flex-row gap-2 overflow-x-scroll">
                  {data?.list.map((item, index) =>

                    <div className="bg-background border-gray-600 border-[1px] flex flex-col justify-center items-center min-h-[180px] min-w-[130px] rounded my-1" key={index}>

                      <p>{format(parseISO(item.dt_txt), "h:mm a")}</p>

                      <WeatherIcon iconName={getDayOrNight(item.weather[0].icon, item.dt_txt)} />

                      <p>{item.weather[0].main}</p>
                      <p className="text-[10px] opacity-80">{item.weather[0].description}</p>
                      <p>{convertKelvinToCelsius(item?.main.temp ?? 0)}&deg;</p>

                    </div>

                  )}
                </div>

                <Link href="https://convert-a-temp.netlify.app/" underline="hover" sx={{ color: '#ff6666' }} className='text-center'>
                  {'Temperature Converter'}
                </Link>
              </Container>
            </>
          }

        </main>

      </div>
    </>

  );
}

function WeatherSkeleton() {
  return (
    <div className="grid place-items-center">
      <span className="loading loading-ring loading-lg"></span>
    </div>
  )
}