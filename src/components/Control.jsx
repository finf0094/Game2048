import Block from "./Block.jsx";

const Control = ({
         keyUp = "⇧",
         keyDown = "⇩",
         keyLeft = "⇦",
         keyRight = "⇨"
}) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Block num={keyUp}/>
            <div style={{display:"flex"}}>
                <Block num={keyLeft}/>
                <Block num={keyDown}/>
                <Block num={keyRight}/>
            </div>
            BOT:  <Block num={"X"}/>
        </div>
    );
};

export default Control;