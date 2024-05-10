import React from "react";

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { cn } from "@/utils/cn";

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export default function SearchBox(props: Props) {

    return (

        <form
            onSubmit={props.onSubmit}
            className={cn("flex relative items-center justify-center h-10",
            props.className)}
        >

            <input
                type="text"
                onChange={props.onChange}
                value={props.value}
                placeholder="Search Location"
                className="cityInput w-[150px] rounded text-primary bg-secondary border-solid border-[1px] border-gray-500 p-1 focus:outline-none focus:border-accent text-sm "
            />

            <button className="searchButton bg-gray-500 text-primary grid place-items-center rounded-r-[2px] absolute right-[1px] p-[2px] h-[28px] ">
                <SearchRoundedIcon className="text-[20px] " />
            </button>

        </form>

    );

}