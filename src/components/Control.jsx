import Block from "./Block.jsx";

const Control = () => {
    return (
        <div>
            <Block num={"W"}/>
            <div style={{display:"flex"}}>
                <Block num={"A"}/>
                <Block num={"S"}/>
                <Block num={"D"}/>
            </div>
            BOT:  <Block num={"X"}/>
        </div>
    );
};

export default Control;