import { PERSON_WIDTH } from "@/app/parcels/batch/columnWidths";
import { BatchActionType } from "@/app/parcels/batch/batchTypes";
import { PersonField } from "@/app/parcels/batch/displayComponents/PersonEditCell";
import { Person } from "@/components/Form/formFunctions";
import dayjs from "dayjs";
import { MINIMUM_NUMBER_OF_ADULTS, MAXIMUM_NUMBER_OF_ADULTS } from "@/app/clients/form/bounds";
import PersonInput from "@/app/parcels/batch/displayComponents/PersonInput";
import { ChangeEvent, useEffect, useState } from "react";
import {
    BottomDiv,
    EditCellInputLabel,
    EditCellTextField,
    PersonInputDiv,
} from "@/app/parcels/batch/displayComponents/EditCellStyledComponents";

interface PersonEditCellInputProps {
    id: number;
    dispatchBatchTableAction: React.Dispatch<BatchActionType>;
    personField: PersonField;
    personArray: Person[];
}

const PersonEditCellInput: React.FC<PersonEditCellInputProps> = ({
    id,
    dispatchBatchTableAction,
    personField,
    personArray,
}) => {
    const [people, setPeople] = useState<Person[]>([]);
    useEffect(() => {
        setPeople(personArray);
    }, [personArray]);
    const minNumberOfPeople =
        personField === "childrenInfo" || id === 0 ? 0 : MINIMUM_NUMBER_OF_ADULTS;
    const maxNumberOfPeople = MAXIMUM_NUMBER_OF_ADULTS;

    const dispatchPerson = (newPeople: Person[]): void => {
        const newValue =
            personField === "adultInfo"
                ? {
                      adults: newPeople,
                      numberOfAdults: newPeople.length,
                  }
                : {
                      children: newPeople,
                      numberOfChildren: newPeople.length,
                  };
        dispatchBatchTableAction({
            type: "update_cell",
            updateCellPayload: {
                rowId: id,
                newValueAndFieldName: {
                    type: "client",
                    fieldName: personField,
                    newValue,
                },
            },
        });
    };

    const getUpdatedPeople = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): Person[] => {
        const boundNumberOfPeople = Math.max(
            minNumberOfPeople,
            Math.min(+event.target.value, maxNumberOfPeople)
        );
        const slicedPeople = people.slice(0, boundNumberOfPeople);
        if (people.length < boundNumberOfPeople) {
            const currentDate = dayjs().startOf("day");
            for (let iterator = people.length; iterator < boundNumberOfPeople; iterator++) {
                personField === "adultInfo"
                    ? slicedPeople.push({
                          gender: "other",
                          birthYear: +currentDate.subtract(16, "year").format("YYYY"),
                      })
                    : slicedPeople.push({
                          gender: "other",
                          birthYear: +currentDate.format("YYYY"),
                      });
            }
        }
        return slicedPeople;
    };

    return (
        <PersonInputDiv>
            <EditCellInputLabel>{`number of ${personField === "adultInfo" ? "adults" : "children"}`}</EditCellInputLabel>
            <EditCellTextField
                width={PERSON_WIDTH}
                inputProps={{ min: 0, max: 20 }}
                defaultValue={people.length === 0 ? null : people.length}
                onChange={(event) => {
                    const updatedPeople: Person[] = getUpdatedPeople(event);
                    setPeople(updatedPeople);
                    dispatchPerson(updatedPeople);
                }}
                type="number"
            />
            {people.map((_, index) => {
                return (
                    <PersonInput
                        key={`person ${index + 1}`}
                        people={people}
                        setPeople={setPeople}
                        index={index}
                        personField={personField}
                        dispatchBatchTableAction={dispatchBatchTableAction}
                        id={id}
                        dispatchPerson={dispatchPerson}
                    />
                );
            })}
            <BottomDiv />
        </PersonInputDiv>
    );
};

export default PersonEditCellInput;
