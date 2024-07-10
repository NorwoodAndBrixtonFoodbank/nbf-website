import React from "react";

import CongestionChargeAppliesIcon from "@/components/Icons/CongestionChargeAppliesIcon";
import CollectionIcon, { CollectionIconProps } from "@/components/Icons/CollectionIcon";
import FlaggedForAttentionIcon from "@/components/Icons/FlaggedForAttentionIcon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import SpeechBubbleIcon, { SpeechBubbleProps } from "@/components/Icons/SpeechBubbleIcon";
import DeliveryIcon from "@/components/Icons/DeliveryIcon";
import StyleManager from "@/app/themes";

const StyledCongestionChargeAppliesIcon: React.FC = () => {
    return (
        <StyleManager>
            <CongestionChargeAppliesIcon />
        </StyleManager>
    );
};
const StyledCollectionIcon: React.FC<CollectionIconProps> = (props) => {
    return (
        <StyleManager>
            <CollectionIcon {...props} />
        </StyleManager>
    );
};

const StyledFlaggedForAttentionIcon: React.FC = () => {
    return (
        <StyleManager>
            <FlaggedForAttentionIcon />
        </StyleManager>
    );
};
const StyledPhoneIcon: React.FC = () => {
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

const StyledDeliveryIcon: React.FC = () => {
    return (
        <StyleManager>
            <DeliveryIcon />
        </StyleManager>
    );
};

describe("Icons", () => {
    it("All Render", () => {
        cy.mount(<StyledCongestionChargeAppliesIcon />);
        cy.mount(<StyledCollectionIcon collectionPoint="Next Door" />);
        cy.mount(<StyledFlaggedForAttentionIcon />);
        cy.mount(<StyledPhoneIcon />);
        cy.mount(<StyledSpeechBubbleIcon onHoverText="Some Bubble Text" />);
        cy.mount(<StyledDeliveryIcon />);
    });

    it("Collection icon text is correct", () => {
        cy.mount(<StyledCollectionIcon collectionPoint="Next Door" />);
        cy.get("svg").find("title").should("have.text", "Collection at Next Door");
    });

    it("Follow-up Phone Call icon text is correct", () => {
        cy.mount(<StyledPhoneIcon />);
        cy.get("svg").find("title").should("have.text", "Requires follow-up phone call");
    });

    it("Congestion Charge Applies icon text is correct", () => {
        cy.mount(<StyledCongestionChargeAppliesIcon />);
        cy.get("svg").find("title").should("have.text", "Congestion charge applies");
    });

    it("Flagged for Attention icon text is correct", () => {
        cy.mount(<StyledFlaggedForAttentionIcon />);
        cy.get("svg").find("title").should("have.text", "Flagged for attention");
    });

    it("Delivery icon text is correct", () => {
        cy.mount(<StyledDeliveryIcon />);
        cy.get("svg").find("title").should("have.text", "Delivery");
    });

    it("Speech Bubble icon text is correct", () => {
        cy.mount(<StyledSpeechBubbleIcon onHoverText="Text On Hover" />);
        cy.get("svg").find("title").should("have.text", "Text On Hover");
    });

    it("Flagged for Attention icon default colour is set", () => {
        cy.mount(<StyledFlaggedForAttentionIcon />);
        cy.get("svg").invoke("attr", "color").should("eq", "orange");
    });

    it("Collection icon with popper shows text on hover", () => {
        cy.mount(<StyledCollectionIcon collectionPoint="The roof" />);
        cy.get("svg").trigger("mouseover");
        cy.get("div").contains("Collection at The roof");
    });

    it("Speech Bubble icon with popper shows text on hover", () => {
        cy.mount(<StyledSpeechBubbleIcon onHoverText="Text On Hover" showTooltip />);
        cy.get("svg").trigger("mouseover");
        cy.get("div").contains("Text On Hover");
    });
});
