function LetterBox({ letter } ) {

    const boxStyle = {
        width: "100px",
        height: "100px",
        border: "10px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: "bold"
    }

    return (
        <div style={boxStyle}>
            {letter}
        </div>
    )
}
export default LetterBox