import '../styles/components/credits.scss'
import Typography from "@material-ui/core/Typography";
import React from "react";

export default function Credits(props) {

    return (
        <Typography className="credentials">
            Powered by <a className="link" href="https://www.chain.link" target="_blank" rel="noreferrer">Chainlink</a>.
        </Typography>
    );
}