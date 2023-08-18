import { useCallback, useState } from "react";

const useForceRerender = (): (() => void) => {
    const [, setTick] = useState(0);
    const update = useCallback(() => {
        setTick((tick) => tick + 1);
    }, []);
    return update;
};

export default useForceRerender;
