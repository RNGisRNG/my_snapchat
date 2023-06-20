const Error = (props) => {

    return(
        <span className="card display-f justify-c mt-1 mb-1 text-red ta-c">
            {props.message}
        </span>
    );
}

export default Error