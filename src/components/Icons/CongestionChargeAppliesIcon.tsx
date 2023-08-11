import React from "react";
import Icon from "@/components/Icons/Icon";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";

const CongestionChargeAppliesIcon: React.FC<{}> = () => {
    return <Icon icon={faCopyright} onHoverText="Congestion charge applies" color="red" />;
};

export default CongestionChargeAppliesIcon;
