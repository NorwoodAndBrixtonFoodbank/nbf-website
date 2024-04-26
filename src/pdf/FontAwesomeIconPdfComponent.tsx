import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Path, Svg } from "@react-pdf/renderer";
import { ReactElement } from "react";

interface FontAwesomeIconProps {
    faIcon: IconDefinition;
}

const FontAwesomeIconPdfComponent = ({ faIcon: { icon } }: FontAwesomeIconProps): ReactElement => {
    const width = icon[0];
    const height = icon[1];
    const unicode = icon[4];
    const isDuoTone = Array.isArray(unicode);
    const paths = isDuoTone ? unicode : [unicode];
    const color = "black";
    return (
        <Svg viewBox={`0 0 ${width} ${height}`} style={{ width: "20px" }}>
            {paths &&
                paths.map((drawnPath, indexNumber) => (
                    <Path
                        d={drawnPath}
                        key="Font Awesome Icon"
                        fill={color}
                        fillOpacity={isDuoTone && indexNumber === 0 ? 0.4 : 1.0}
                    />
                ))}
        </Svg>
    );
};

export default FontAwesomeIconPdfComponent;
