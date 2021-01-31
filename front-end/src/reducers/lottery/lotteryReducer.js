const initialState = {
    duration: 0,
    nbOfPlayers: 0,
    pot: 0,
    state: "CLOSED",
    ticketPrice: 0,
    winner: null
}

export default function lotteryReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOTTERY/INIT':
            return {...state, duration: action.payload.duration, nbOfPlayers: action.payload.nbOfPlayers, pot: action.payload.pot, ticketPrice: action.payload.ticketPrice, winner: action.payload.winner, state: action.payload.state}
        case 'LOTTERY/STARTED':
            return {...state, duration: action.payload.duration, ticketPrice: action.payload.ticketPrice, state: "OPEN"}
        case 'LOTTERY/STATE_CHANGED':
            return {...state, state: action.payload.state}
        case 'LOTTERY/ENDED':
            return {...state, winner: action.payload.winner, state: "CLOSED"}
        case 'LOTTERY/NEW_ENTRY':
            return {...state, nbOfPlayers: action.payload.nbOfPlayers, pot: state.ticketPrice * action.payload.nbOfPlayers}
        default:
            return state
    }
}