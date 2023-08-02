import { Schema } from "@/supabase";
import ActionBar from "@/app/clients/ActionBar";

describe("Clients - Action Bar", () => {
    const mockData: Schema["clients"][] = [
        {
            address_1: "",
            address_2: "",
            address_county: "",
            address_postcode: "",
            address_town: "",
            baby_food: true,
            delivery_instructions: "",
            dietary_requirements: [],
            extra_information: "",
            family_id: "",
            feminine_products: [],
            flagged_for_attention: false,
            full_name: "",
            other_items: [],
            pet_food: [],
            phone_number: "",
            primary_key: "",
            signposting_call_required: false,
        },
    ];

    const selectedIndices = [0];

    it("should render", () => {
        cy.mount(<ActionBar data={mockData} selected={selectedIndices} />);
    });
});
