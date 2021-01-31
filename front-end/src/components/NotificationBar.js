import '../styles/components/notification-bar.scss'
import React from "react";
import Typography from "@material-ui/core/Typography";

export default function NotificationBar(props) {

    return (
        <Typography className="banner">
            🚨 Running on <a className="link" href={"https://kovan.etherscan.io/address/" + process.env.REACT_APP_LOTTERY_CONTRACT_ADDRESS} target="_blank" rel="noreferrer"><strong>Testnet</strong></a>.
        </Typography>
    );
}