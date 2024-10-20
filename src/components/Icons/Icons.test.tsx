import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import CongestionChargeAppliesIcon from "@/components/Icons/CongestionChargeAppliesIcon";
import CollectionIcon, { CollectionIconProps } from "@/components/Icons/CollectionIcon";
import FlaggedForAttentionIcon from "@/components/Icons/FlaggedForAttentionIcon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import SpeechBubbleIcon, { SpeechBubbleProps } from "@/components/Icons/SpeechBubbleIcon";
import DeliveryIcon from "@/components/Icons/DeliveryIcon";
import StyleManager from "@/app/themes";
import userEvent from "@testing-library/user-event";

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
    afterEach(() => {
        cleanup();
    });

    it("All Render", () => {
        render(<StyledCongestionChargeAppliesIcon />);
        render(<StyledCollectionIcon collectionPoint="Next Door" />);
        render(<StyledFlaggedForAttentionIcon />);
        render(<StyledPhoneIcon />);
        render(<StyledSpeechBubbleIcon onHoverText="Some Bubble Text" />);
        render(<StyledDeliveryIcon />);
    });

    it("Collection icon text is correct", () => {
        render(<StyledCollectionIcon collectionPoint="Next Door" />);

        expect(screen.getByRole("img").textContent).toBe("Collection at Next Door");
    });

    it("Follow-up Phone Call icon text is correct", () => {
        render(<StyledPhoneIcon />);

        expect(screen.getByRole("img").textContent).toBe("Requires follow-up phone call");
    });

    it("Congestion Charge Applies icon text is correct", () => {
        render(<StyledCongestionChargeAppliesIcon />);

        expect(screen.getByRole("img").textContent).toBe("Congestion charge applies");
    });

    it("Flagged for Attention icon text is correct", () => {
        render(<StyledFlaggedForAttentionIcon />);

        expect(screen.getByRole("img").textContent).toBe("Flagged for attention");
    });

    it("Delivery icon text is correct", () => {
        render(<StyledDeliveryIcon />);

        expect(screen.getByRole("img").textContent).toBe("Delivery");
    });

    it("Speech Bubble icon text is correct", () => {
        render(<StyledSpeechBubbleIcon onHoverText="Text On Hover" />);

        expect(screen.getByRole("img").textContent).toBe("Text On Hover");
    });

    it("Flagged for Attention icon default colour is set", () => {
        render(<StyledFlaggedForAttentionIcon />);

        expect(screen.getByRole("img")).toHaveAttribute("color", "orange");
    });

    it("Speech Bubble icon shows text on hover", () => {
        userEvent.setup();
        render(<StyledSpeechBubbleIcon onHoverText="Text On Hover" showTooltip />);

        userEvent.hover(screen.getByLabelText("Text On Hover"));

        expect(screen.getByRole("tooltip")).toBeVisible();
        expect(screen.getByRole("tooltip")).toHaveTextContent("Text On Hover");
    });
});
