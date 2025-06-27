import { useState } from "react";

export const useBoolean= ()=>{

const [value, setValue] = useState<Record<string, boolean>>({}  );

const isState= (key: string)=>{
    return value[key] ?? false;
}

const changeState= (key: string, value: boolean)=>{
    setValue((prev)=>({...prev, [key]: value}));
}
const toggleState= (key: string)=>{
    setValue((prev)=>({...prev, [key]: !prev[key]}));
}



return {
    isState,
    changeState,
    toggleState,
}

}