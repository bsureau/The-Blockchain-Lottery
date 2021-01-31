import './App.scss'
import Action from "./components/Action"
import Badge from '@material-ui/core/Badge';
import {Card} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Credits from "./components/Credits";
import {ethers} from "ethers";
import LotteryService from "./services/LotteryService";
import NotificationBar from "./components/NotificationBar";
import React, {useEffect, useState} from 'react'
import Typography from '@material-ui/core/Typography';
import {useSelector, useDispatch} from "react-redux"

const getLotteryState = state => state.lottery;

function App() {

    const [isLoaded, setIsLoaded] = useState(false);
    const [exception, setException] = useState(null);

    const lottery = useSelector(getLotteryState);
    const dispatch = useDispatch();

    useEffect( () => {

        async function initDatas() {
            try {
                const lotteryService = new LotteryService();
                const duration = new Date(await lotteryService.getDuration());
                const nbOfPlayers = await lotteryService.getNbPlayers();
                const state = await lotteryService.getLotteryState();
                const ticketPrice = await lotteryService.getTicketPrice();
                const pot = nbOfPlayers * ticketPrice;
                const winner = await lotteryService.getWinner();

                lotteryService.contract.on("lotteryStarted", (newDuration, newTicketPrice) => {
                    dispatch({type: "LOTTERY/STARTED", payload: {duration: new Date(newDuration * 1000), ticketPrice: ethers.utils.formatEther(newTicketPrice)}});
                });
                lotteryService.contract.on("lotteryStateChanged", (newState) => {
                    dispatch({type: "LOTTERY/STATE_CHANGED", payload: {state: lotteryService.printLotteryState(newState)}});
                });
                lotteryService.contract.on("lotteryEnded", (newWinner) => {
                    dispatch({type: "LOTTERY/ENDED", payload: {winner: newWinner}});
                });
                lotteryService.contract.on("newEntryAdded", (newNbOfPlayers) => {
                    dispatch({type: "LOTTERY/NEW_ENTRY", payload: {nbOfPlayers: newNbOfPlayers.toString()}});
                });

                dispatch({type: 'LOTTERY/INIT', payload: {duration: duration, nbOfPlayers: nbOfPlayers, pot: pot, state: state, ticketPrice: ticketPrice, winner: winner}});
            } catch(e) {
                if (process.env.REACT_APP_ENV === "DEV")
                    console.error("Error: " + e);
                setException({code: "error", message: "💀 An error occured on data init 💀"});
            }
            setIsLoaded(true);
        }

        initDatas();

    }, []);

    return (
        <div className="App">
            <NotificationBar />
            { isLoaded ?
                exception === null ?
                    <Card className="card">
                        <CardContent>
                            <Typography className="title" color="textPrimary">
                                💸 The Blockchain Lottery 💸
                            </Typography>
                            <Typography className="paragraph">
                                <strong>Status: </strong><br/>
                                <Badge className="badge" color="primary" badgeContent={(lottery.state === "OPEN" ) ? "OPEN until " + lottery.duration.toDateString() + " - " + lottery.duration.toLocaleTimeString(): lottery.state} />
                            </Typography>
                            <Typography className="paragraph">
                                <strong>Entries: </strong><br/>
                                {lottery.nbOfPlayers} player{lottery.nbOfPlayers > 1 ? "s" : ""}
                            </Typography>
                            <Typography className="paragraph">
                                <strong>Pot: </strong><br/>
                                <span className="pot">{lottery.pot} ETH</span>
                            </Typography>
                        </CardContent>
                        <Action />
                    </Card>
                    :
                    <Typography className="loader">
                        <strong>{exception.message}</strong>
                    </Typography>
                :
                <div className="loader">
                    <strong>⌛ Loading... ⌛</strong>
                </div>
            }
            <Credits />
        </div>
    );
}

export default App;