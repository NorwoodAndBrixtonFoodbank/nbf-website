import React from "react";

import CongestionChargeAppliedIcon from "@/components/Icons/CongestionChargeAppliesIcon";
import FeetIcon, { FeetIconProps } from "@/components/Icons/FeetIcon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import SpeechBubbleIcon, { SpeechBubbleProps } from "@/components/Icons/SpeechBubbleIcon";
import TruckIcon from "@/components/Icons/TruckIcon";
import StyleManager from "@/app/themes";
import FlagIcon from "@/components/Icons/FlagIcon";

const StyledCongestionChargeAppliedIcon: React.FC<{}> = () => {
    return (
        <StyleManager>
            <CongestionChargeAppliedIcon />
        </StyleManager>
    );
};
const StyledFeetIcon: React.FC<FeetIconProps> = (props) => {
    return (
        <StyleManager>
            <FeetIcon {...props} />
        </StyleManager>
    );
};

const StyledFlagIcon: React.FC<{}> = () => {
    return (
        <StyleManager>
            <FlagIcon />
        </StyleManager>
    );
};
const StyledPhoneIcon: React.FC<{}> = () => {
    return (
        <StyleManager>
            <PhoneIcon />
        </StyleManager>
    );
};

const StyledSpeechBubbleIcon: React.FC<SpeechBubbleProps> = (props) => {
    return (
        <StyleManager>
            <SpeechBubbleIcon {...props} />
        </StyleManager>
    );
};

const StyledTruckIcon: React.FC<{}> = () => {
    return (
        <StyleManager>
            <TruckIcon />
        </StyleManager>
    );
};

describe("Icons", () => {
    it("All Render", () => {
        cy.mount(<StyledCongestionChargeAppliedIcon />);
        cy.mount(<StyledFeetIcon collectionPoint="Next Door" />);
        cy.mount(<StyledFlagIcon />);
        cy.mount(<StyledPhoneIcon />);
        cy.mount(<StyledSpeechBubbleIcon onHoverText="Some Bubble Text" />);
        cy.mount(<StyledTruckIcon />);
    });

    it("Feet icon text is correct", () => {
        cy.mount(<StyledFeetIcon collectionPoint="Next Door" />);
        cy.get("svg").find("title").should("have.text", "Collection at Next Door");
    });

    it("Phone icon text is correct", () => {
        cy.mount(<StyledPhoneIcon />);
        cy.get("svg").find("title").should("have.text", "Requires follow-up phone call");
    });

    it("Congestion Charge Applies icon text is correct", () => {
        cy.mount(<StyledCongestionChargeAppliedIcon />);
        cy.get("svg").find("title").should("have.text", "Congestion charge applies");
    });

    it("Flag icon text is correct", () => {
        cy.mount(<StyledFlagIcon />);
        cy.get("svg").find("title").should("have.text", "Flagged for attention");
    });

    it("Truck icon text is correct", () => {
        cy.mount(<StyledTruckIcon />);
        cy.get("svg").find("title").should("have.text", "Delivery");
    });

    it("Speech Bubble icon text is correct", () => {
        cy.mount(<StyledSpeechBubbleIcon onHoverText="Text On Hover" />);
        cy.get("svg").find("title").should("have.text", "Text On Hover");
    });

    it("Flag icon default colour is set", () => {
        cy.mount(<StyledFlagIcon />);
        cy.get("svg").invoke("attr", "color").should("eq", "orange");
    });

    it("Feet icon with popper shows text on hover", () => {
        cy.mount(<StyledFeetIcon collectionPoint="The roof" />);
        cy.get("svg").trigger("mouseover");
        cy.get("div").contains("Collection at The roof");
    });

    it("Speech Bubble icon with popper shows text on hover", () => {
        cy.mount(<StyledSpeechBubbleIcon onHoverText="Text On Hover" showTooltip />);
        cy.get("svg").trigger("mouseover");
        cy.get("div").contains("Text On Hover");
    });
});
