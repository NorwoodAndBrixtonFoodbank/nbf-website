import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import DropdownListInput from "@/components/DataInput/DropdownListInput";
import { errorExists, errorText, onChangeText } from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const CreateUserForm: React.FC<{}> = () => {
    return (
        <>
            <GenericFormCard
                title="Account Details"
                required={true}
                text="Please enter the email and temporary password for the new user."
            >
                <>
                    <FreeFormTextInput
                        label="Email"
                        // error={errorExists(formErrors.addressLine1)}
                        // helperText={errorText(formErrors.addressLine1)}
                        // onChange={onChangeText(fieldSetter, errorSetter, "addressLine1", true)}
                    />
                    <FreeFormTextInput
                        label="Password"
                        // error={errorExists(formErrors.addressPostcode)}
                        // helperText={errorText(formErrors.addressPostcode)}
                        // onChange={onChangeText(
                        //     fieldSetter,
                        //     errorSetter,
                        //     "addressPostcode",
                        //     true,
                        //     postcodeRegex,
                        //     formatPostcode
                        // )}
                    />
                </>
            </GenericFormCard>
            <GenericFormCard title="User Role" required={true}>
                <DropdownListInput
                    listTitle="User Role"
                    defaultValue="caller"
                    labelsAndValues={[
                        ["Caller", "caller"],
                        ["Admin", "admin"],
                    ]}
                />
            </GenericFormCard>
        </>
    );
};

export default CreateUserForm;
