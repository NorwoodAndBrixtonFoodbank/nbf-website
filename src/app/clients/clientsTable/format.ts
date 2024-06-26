import { DeleteClientError } from "../deleteClient";
import { IsClientActiveError } from "../getExpandedClientDetails";

export const getIsClientActiveErrorMessage = (error: IsClientActiveError): string => {
    switch (error.type) {
        case "failedClientIsActiveFetch":
            return `Failed to determine whether client is active. Please reload. Log ID: ${error.logId}`;
    }
};

export const getDeleteClientErrorMessage = (error: DeleteClientError): string => {
    switch (error.type) {
        case "failedClientDeletion":
            return `Failed to delete client. Please try again later. Log ID: ${error.logId}`;
    }
};
