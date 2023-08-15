import { useState, useEffect } from "react";

const useLocalStorage = <T>(key: string, initialValue: T): [T, (newValue: T) => void] => {
    const [value, setValue] = useState<T>(initialValue);

    useEffect(() => {
        const value = window.localStorage.getItem(key);
        if (value !== null) {
            setValue(JSON.parse(value));
        }
    }, [key]);

    const setLocalStorageValue = (value: T): void => {
        setValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    };

    return [value, setLocalStorageValue];
};

export default useLocalStorage;
