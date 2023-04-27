import {React} from "react";
import {getColor} from "../utils/getColor.js";

const style = {
    blockStyle: {
        height: 80,
        width: 80,
        margin: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 45,
        fontWeight: "800",
        color: "white",
        borderRadius: 7
    },

};

const Block = ({num}) => {
    const {blockStyle} = style;

    return (
        <div
            style={{
                backgroundColor: num == 0 ? "lightgray" : getColor(num),
                ...blockStyle,
                color: num === 2 || num === 4 ? "yellow" : "",
                transition: "all 100ms ease"
            }}
        >
            {/*{num !== 0 ? num : ""}*/}
            {num}
        </div>
    );
};

export default Block;