'use client';

import React, { useRef, useState } from "react";
import SearchBox from "./SearchBox";

import CloudIcon from '@mui/icons-material/Cloud';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { FaLocationCrosshairs } from "react-icons/fa6";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { WiLightning } from "react-icons/wi";
import axios from "axios";
import { placeAtom, loadingCityAtom } from "@/app/atom";
import { useAtom } from "jotai";

type Props = { location: string };

export default function Navbar({ location }: Props) {

    const APIKEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

    const [city, setCity] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const [place, setPlace] = useAtom(placeAtom);
    const [_, setLoadingCity] = useAtom(loadingCityAtom);

    async function handleChange(value: string) {
        setCity(value);
        if (value.length >= 3) {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${APIKEY}`);
                const suggestions = response.data.list.map((item: any) => item.name);

                setSuggestions(suggestions);
                setShowSuggestions(true);
                setError("")
            } catch (error) {
                setSuggestions([]);
                setShowSuggestions(false);
                // setError("Error fetching data");
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    function handleSuggestionClick(item: string) {
        setCity(item);
        setShowSuggestions(false);
    };

    function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
        setLoadingCity(true);
        e.preventDefault();
        if (suggestions.length == 0) {
            setError("Location not found");
            setLoadingCity(false);
        } else {
            setError("");
            setTimeout(() => {
                setLoadingCity(false);
                setPlace(city);
                setShowSuggestions(false);
                setCity("");
            }, 500);
        }
    };

    function handleCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    setLoadingCity(true);
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`);
                    setTimeout(() => {
                        setLoadingCity(false);
                        setPlace(response.data.name);
                    }, 500);
                } catch (error) {
                    setLoadingCity(false);
                }
            });
        }
    };

    function logoClick() {
        window.open("https://anshuport.netlify.app/", "_blank");
    }

    return (
        <nav className="shadow-xl shadow-background sticky top-0 left-0 z-50 bg-secondary">
            <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto text-primary max-[500px]:flex-col max-[500px]:gap-2 max-[500px]:h-[100px] max-[500px]:py-1">

                <div onClick={logoClick} className="logo text-3xl flex flex-row items-center justify-center gap-2 relative cursor-pointer">
                    <h1 className="text-2xl">Weather App</h1>
                    <p className="text-[10px] absolute -bottom-[17px] left-[3px]">ANSHUMAN <span className="bg-primary text-secondary felx items-center justify-center px-[2px]">STUDIOS</span></p>
                    <CloudIcon className="z-10  text-blue-400 " />
                    <LightModeOutlinedIcon className="z-9 absolute -right-[8px] -top-0 animate-spin-slow text-yellow-300" />
                    <WiLightning className="absolute z-20 -right-[3px] -bottom-[10px] text-yellow-400 animate-pulse " />
                </div>

                <div className="flex gap-2 items-center text-xl">
                    <div className="tooltip tooltip-left" data-tip="Current Location">
                        <FaLocationCrosshairs onClick={handleCurrentLocation} className="text-gray-400 hover:rotate-180 hover:text-accent cursor-pointer" />
                    </div>
                    <div className="location relative grid place-items-center">
                        <LocationOnIcon className="locationIcon absolute opacity-80 text-dull-red -top-[16px] animate-bounce-slow" />
                        <p className="text-sm">{location}</p>
                    </div>
                    <div className="relative">
                        <SearchBox
                            value={city}
                            onChange={(e) => handleChange(e.target.value)}
                            onSubmit={(e) => handleSubmitSearch(e)}
                        />
                        <SuggestionBox
                            suggestions={suggestions}
                            showSuggestions={showSuggestions}
                            handleSuggestionClick={handleSuggestionClick}
                            error={error}
                        />
                    </div>
                </div>

            </div>
        </nav>
    );
}

function SuggestionBox({
    suggestions,
    showSuggestions,
    handleSuggestionClick,
    error
}: {
    suggestions: string[];
    showSuggestions: boolean;
    handleSuggestionClick: (item: string) => void;
    error: string;
}) {
    return (
        <>
            {((showSuggestions && suggestions.length > 1) || error) && (
                <ul className="flex flex-col absolute top-[40px] left-0 w-full rounded border-[1px] border-gray-600 p-1 bg-secondary">

                    {error && (
                        <li className="p-1 text-dull-red">{error}</li>
                    )}
                    {suggestions.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(item)}
                            className="cursor-pointer p-1 hover:bg-accent hover:text-secondary rounded-[2px] text-sm">
                            {item}
                        </li>
                    ))}

                </ul>
            )}
        </>
    )
}