import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Path, Svg } from "@react-pdf/renderer";
import { ReactElement } from "react";

interface FontAwesomeIconProps {
    faIcon: IconDefinition;
}

const FontAwesomeIconPdfComponent = ({ faIcon: { icon } }: FontAwesomeIconProps): ReactElement => {
    const duotone = Array.isArray(icon[4]);
    const paths = Array.isArray(icon[4]) ? icon[4] : [icon[4]];
    const color = "black";
    return (
        <Svg viewBox={`0 0 ${icon[0]} ${icon[1]}`} style={{ width: "20px" }}>
            {paths &&
                paths.map((drawnPath, indexNumber) => (
                    <Path
                        d={drawnPath}
                        key="Font Awesome Icon"
                        fill={color}
                        fillOpacity={duotone && indexNumber === 0 ? 0.4 : 1.0}
                    />
                ))}
        </Svg>
    );
};

export default FontAwesomeIconPdfComponent;
