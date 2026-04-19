function Example({ pic } ) {

    const boxStyle = {
        width: "350px",
        height: "350px",
        border: "5px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "340px",
        fontWeight: "bold",
        margin: "0 auto",
        position: "absolute",
        right: "25px",
        top:"390px"
    }

    return (
        <div style={boxStyle}>
            <img src={pic} width="100%" height = "100%" style={{objectFit: "contain"}}/>
        </div>
    )
}
export default Example