"use client";

import { useState, useEffect } from "react";

const useLocalStorage = <T>(key: string, initialValue: T): [T, (newValue: T) => void] => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const storedValue = window.localStorage.getItem(key);
        if (storedValue !== null) {
            setValue(JSON.parse(storedValue));
        }
    }, [key]);

    const setLocalStorageValue = (value: T): void => {
        setValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    };

    return [value, setLocalStorageValue];
};

export default useLocalStorage;
