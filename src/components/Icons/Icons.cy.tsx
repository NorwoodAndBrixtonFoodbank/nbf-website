import React from "react";

import CongestionChargeAppliesIcon from "@/components/Icons/CongestionChargeAppliesIcon";
import CollectionIcon from "@/components/Icons/CollectionIcon";
import FlaggedForAttentionIcon from "@/components/Icons/FlaggedForAttentionIcon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import SpeechBubbleIcon from "@/components/Icons/SpeechBubbleIcon";
import DeliveryIcon from "@/components/Icons/DeliveryIcon";

describe("Icons", () => {
    it("All Render", () => {
        cy.mount(<CongestionChargeAppliesIcon />);
        cy.mount(<CollectionIcon collectionPoint="Next Door" />);
        cy.mount(<FlaggedForAttentionIcon />);
        cy.mount(<PhoneIcon />);
        cy.mount(<SpeechBubbleIcon onHoverText="Some Bubble Text" />);
        cy.mount(<DeliveryIcon />);
    });

    it("Feet icon text is correct", () => {
        cy.mount(<CollectionIcon collectionPoint="Next Door" />);
        cy.get("svg").find("title").should("have.text", "Collection at Next Door");
    });

    it("Phone icon text is correct", () => {
        cy.mount(<PhoneIcon />);
        cy.get("svg").find("title").should("have.text", "Requires follow-up phone call");
    });

    it("Congestion Charge Applies icon text is correct", () => {
        cy.mount(<CongestionChargeAppliesIcon />);
        cy.get("svg").find("title").should("have.text", "Congestion charge applies");
    });

    it("Flag icon text is correct", () => {
        cy.mount(<FlaggedForAttentionIcon />);
        cy.get("svg").find("title").should("have.text", "Flagged for attention");
    });

    it("Truck icon text is correct", () => {
        cy.mount(<DeliveryIcon />);
        cy.get("svg").find("title").should("have.text", "Delivery");
    });

    it("Speech Bubble icon text is correct", () => {
        cy.mount(<SpeechBubbleIcon onHoverText="Text On Hover" />);
        cy.get("svg").find("title").should("have.text", "Text On Hover");
    });

    it("Flag icon default colour is set", () => {
        cy.mount(<FlaggedForAttentionIcon />);
        cy.get("svg").invoke("attr", "color").should("eq", "orange");
    });
});
