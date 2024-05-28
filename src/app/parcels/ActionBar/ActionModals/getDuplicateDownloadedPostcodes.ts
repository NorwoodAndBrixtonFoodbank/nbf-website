import { getParcelPostcodesByEvent } from "@/app/parcels/parcelsTable/fetchParcelTableData";

type DataCallbackType = (postcodes: (string | null)[]) => any;
type ErrorCallbackType = (msg: string) => void;

export const getDuplicateDownloadedPostcodes = async (
    parcelIds: string[],
    targetEventName: string,
    dataCallback: DataCallbackType,
    errorCallback: ErrorCallbackType
): Promise<void> => {
    const { postcodes, error } = await getParcelPostcodesByEvent(targetEventName, parcelIds);
    if (error) {
        errorCallback(`Failed to fetch parcels with ${targetEventName} events.`);
        return;
    }
    dataCallback(postcodes);
};
