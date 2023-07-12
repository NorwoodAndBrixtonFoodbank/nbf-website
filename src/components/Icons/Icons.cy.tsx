import React from "react";

import CongestionChargeAppliedIcon from "@/components/Icons/CongestionChargeAppliesIcon";
import FeetIcon from "@/components/Icons/FeetIcon";
import FlagIcon from "@/components/Icons/FlagIcon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import SpeechBubbleIcon from "@/components/Icons/SpeechBubbleIcon";
import TruckIcon from "@/components/Icons/TruckIcon";

describe("Icons", () => {
    it("All Render", () => {
        cy.mount(<CongestionChargeAppliedIcon />);
        cy.mount(<FeetIcon collectionPoint={"Next Door"} />);
        cy.mount(<FlagIcon />);
        cy.mount(<PhoneIcon />);
        cy.mount(<SpeechBubbleIcon onHoverText={"Some Bubble Text"} />);
        cy.mount(<TruckIcon />);
    });

    it("Feet icon text is correct", () => {
        cy.mount(<FeetIcon collectionPoint={"Next Door"} />);
        cy.get("svg").find("title").should("have.text", "Collection at Next Door");
    });

    it("Phone icon text is correct", () => {
        cy.mount(<PhoneIcon />);
        cy.get("svg").find("title").should("have.text", "Requires follow-up phone call");
    });

    it("Congestion Charge Applies icon text is correct", () => {
        cy.mount(<CongestionChargeAppliedIcon />);
        cy.get("svg").find("title").should("have.text", "Congestion charge applies");
    });

    it("Flag icon text is correct", () => {
        cy.mount(<FlagIcon />);
        cy.get("svg").find("title").should("have.text", "Flagged for attention");
    });

    it("Truck icon text is correct", () => {
        cy.mount(<TruckIcon />);
        cy.get("svg").find("title").should("have.text", "Delivery");
    });

    it("Speech Bubble icon text is correct", () => {
        cy.mount(<SpeechBubbleIcon onHoverText={"Text On Hover"} />);
        cy.get("svg").find("title").should("have.text", "Text On Hover");
    });

    it("Flag icon default colour is set", () => {
        cy.mount(<FlagIcon />);
        cy.get("svg").invoke("attr", "color").should("eq", "orange");
    });
});
