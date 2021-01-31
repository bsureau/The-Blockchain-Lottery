import '../styles/components/action.scss'
import Button from "@material-ui/core/Button";
import React, {useState} from "react";
import LotteryService from "../services/LotteryService";
import {CircularProgress, Dialog} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowDropDownCircleOutlinedIcon from '@material-ui/icons/ArrowDropDownCircleOutlined';
import CancelIcon from '@material-ui/icons/Cancel';
import {useSelector} from "react-redux";

const getLotteryState = state => state.lottery;

export default function Actions(props) {

    const [open, setOpen] = useState(false);
    const [exception, setException] = useState(null);
    const [isTransactionSent, setIsTransactionSent] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);

    const lottery = useSelector(getLotteryState);

    function handleModal() {
        setOpen(!open);
    }

    async function handleSubmit() {
        try {
            setException(null);
            setIsTransactionSent(false);
            handleModal();
            const lotteryService = new LotteryService();
            const txHash = await lotteryService.newEntry(lottery.ticketPrice);
            setTransactionHash(txHash);
            setIsTransactionSent(true);
        } catch(e) {
            if (process.env.REACT_APP_ENV === "DEV")
                console.error(e);
            if (e.code === 4001) //Tx rejected by metamask user
                setOpen(false);
            else if (e.code === "already_in") //User already have participated to the lottery
                setException({code: e.code, message: e.message})
            else
                setException({code: "ERROR", message: "An error occured"})
        }
    }

    return (
        <div className="actions">
            { lottery.state === "OPEN SOON" &&
                <Typography className="paragraph">
                    <strong>LOTTERY WILL OPEN SOON...</strong>
                </Typography>
            }
            { lottery.state === "OPEN" && window.ethereum === undefined &&
                <Button className="link" href="https://metamask.io/" target="_blank" color="primary">
                    DOWNLOAD METAMASK TO PARTICIPATE
                </Button>
            }
            { lottery.state === "OPEN" && window.ethereum &&
                <Button className="button" href="#buy-ticket" variant="contained" color="primary" onClick={handleSubmit}>
                    BUY YOUR TICKET NOW ({lottery.ticketPrice} ETH)
                </Button>
            }
            { lottery.state === "PICKING A WINNER" &&
                <Typography className="paragraph">
                    <strong>PICKING A WINNER...</strong>
                </Typography>
            }
            { lottery.state === "CLOSED" &&
                <Button className="link" href={"https://kovan.etherscan.io/address/" + lottery.winner}  target="_blank" color="primary">
                    🎉 SEE THE WINNER 🎉
                </Button>
            }
            <Dialog onClose={handleModal} open={open}>
                <div className="transaction-modal">
                    { exception ?
                        <div>
                            <Typography>
                                <CancelIcon style={{fontSize: 60, color: "red"}} /><br/>
                                <strong>{exception.message}</strong><br/>
                            </Typography>
                            <Button className="link" href="#text-buttons" color="primary" onClick={handleModal}>
                                CLOSE
                            </Button>
                        </div>
                        :
                        !isTransactionSent ?
                            <div>
                                <CircularProgress />
                                <Typography>
                                    <strong>Confirm transaction...</strong>
                                </Typography>
                            </div>
                            :
                            <div>
                                <Typography>
                                    <ArrowDropDownCircleOutlinedIcon color="primary" style={{fontSize: 60}} /><br/>
                                    <strong>Transaction sent! </strong><br/>
                                    <span><a href={"https://kovan.etherscan.io/tx/" + transactionHash} target="_blank" rel="noreferrer">See it on Etherscan</a></span>
                                </Typography>
                                <Button className="link" href="#text-buttons" color="primary" onClick={handleModal}>
                                    OK
                                </Button>
                            </div>
                    }
                </div>
            </Dialog>
        </div>
    );
}