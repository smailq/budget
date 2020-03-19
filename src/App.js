import React from 'react';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {makeStyles} from '@material-ui/core/styles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Grid from "@material-ui/core/Grid";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import IconButton from "@material-ui/core/IconButton";
import SettingsSharpIcon from '@material-ui/icons/SettingsSharp';
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from '@material-ui/icons/Close';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';

const moment = require('moment');

const useStyles = makeStyles(theme => ({
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        marginBottom: '1rem',
    },
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: '#f7f7f7',
    },
    balanceDisplay: {
        marginBottom: '3rem',
    },
    topMenu: {
        padding: '0.5rem',
    },
    icon: {
        color: '#d2d2d2',
    },
    margin: {
        marginTop: '5rem',
    },
    amountUpdateBox: {
        marginTop: '56px',
        padding: '2rem'
    },
    warningIcon: {
        width: 15,
        height: 15,
        color: '#f50057',
    },
    link: {
        display: 'flex',
        textDecoration: 'none!important'
    }
}));


function UpdateBalanceDialog(props) {
    const [amount, setAmount] = React.useState('');
    const [note, setNote] = React.useState('');
    const classes = useStyles();
    const {show, hide, addExpense} = props;

    function save() {
        if (isNaN(parseInt(amount))) {
            return;
        }
        addExpense(-1 * parseInt(amount), note.toLowerCase());
        hide();
        setAmount('');
        setNote('');
    }

    function close() {
        setAmount('');
        setNote('');
        hide();
    }

    return (
        <Dialog
            fullScreen
            open={show}
        >
            <AppBar>
                <Toolbar>
                    <Typography variant="h6">
                        Record Spending
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={close}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                className={classes.amountUpdateBox}
                textAlign='center'
            >
                <FormControl fullWidth>
                    <InputLabel htmlFor="standard-adornment-amount">
                        Spent Amount
                    </InputLabel>
                    <Input
                        style={{fontSize: '5em'}}
                        id="standard-adornment-amount"
                        value={amount}
                        onChange={event => {
                            setAmount(event.target.value)
                        }}
                        autoFocus={true}
                        type='number'
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    />
                </FormControl>
                <FormControl fullWidth style={{marginTop: '1em'}}>
                    <InputLabel htmlFor="note-input">
                        Note
                    </InputLabel>
                    <Input
                        id="note-input"
                        value={note}
                        onChange={event => {
                            setNote(event.target.value)
                        }}
                    />
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    style={{marginTop: '2rem', padding: '1rem 2rem'}}
                    onClick={save}
                >
                    Save
                </Button>
            </Box>
        </Dialog>
    );
}

function TopBar(props) {
    const classes = useStyles();
    const {selectedRange, setDateRange, lowBalanceRanges} = props;
    return (
        <Box className={classes.topBar}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    className={classes.link}
                    onClick={() => setDateRange('week')}
                    color={lowBalanceRanges.indexOf('week') >= 0 ? 'secondary' : undefined}
                    style={{
                        borderBottom: selectedRange === 'week' ? '2px solid' : 'none',
                    }}
                >
                    This Week
                </Link>
                <Link
                    className={classes.link}
                    onClick={() => setDateRange('month')}
                    color={lowBalanceRanges.indexOf('month') >= 0 ? 'secondary' : undefined}
                    style={{
                        borderBottom: selectedRange === 'month' ? '2px solid' : 'none',
                    }}
                >
                    {moment().format('MMMM')}
                </Link>
                <Link
                    className={classes.link}
                    onClick={() => setDateRange('year')}
                    color={lowBalanceRanges.indexOf('year') >= 0 ? 'secondary' : undefined}
                    style={{
                        borderBottom: selectedRange === 'year' ? '2px solid' : 'none',
                    }}
                >
                    {moment().format('Y')}
                </Link>
            </Breadcrumbs>
            <IconButton aria-label="setting" size="small" className={classes.icon}>
                <SettingsSharpIcon/>
            </IconButton>
        </Box>
    );
}

function RemainingBalance(props) {
    const classes = useStyles();
    const {showDialog, remainingBudget} = props;

    return (
        <Box className={classes.balanceDisplay} textAlign="center">
            <Typography variant="h5" color="secondary">
                Entertainment
            </Typography>
            <Typography variant="overline" color="secondary">
                12% Over
            </Typography>
            <Typography variant="h1" color={remainingBudget < 0 ? 'secondary' : undefined}>
                ${remainingBudget}
            </Typography>
            <Button
                style={{marginTop: '1rem'}}
                variant="contained"
                color="primary"
                onClick={showDialog}
            >
                Add Expense
            </Button>
        </Box>
    );
}

function Ledger(props) {

    const {items, groupByFormat, selectedRange} = props;

    const formattedItems = items.map(v => {
        return {
            ...v,
            label: moment(v.date).format(groupByFormat),
        };
    });

    const groupedItems = formattedItems.reduce((acc, v) => {
        const existingAmount = acc[v.label] ? (acc[v.label].amount || 0) : 0;
        const existingNotes = acc[v.label] ? (acc[v.label].notes || []) : [];
        acc[v.label] = {
            ...v,
            amount: v.amount + existingAmount,
            notes: v.note ? [...existingNotes, v.note] : existingNotes,
        };
        return acc;
    }, {});

    const sortedItems = Object.values(groupedItems).sort((a, b) => {
        if (moment(a.date) < moment(b.date)) {
            return -1;
        }
        if (moment(a.date) > moment(b.date)) {
            return 1;
        }
        return 0;
    });

    return (
        <TableContainer>
            <Table aria-label="simple table">
                <TableBody>
                    {sortedItems.map(row => {
                            const uniqueNotes = row.notes.filter((v, i, s) => s.indexOf(v) === i);
                            return (
                                <TableRow key={row.date}>
                                    <TableCell component="th" scope="row">
                                        {row.label}
                                    </TableCell>
                                    {
                                        selectedRange !== 'year' && (
                                            <TableCell
                                                style={{color: 'grey'}}
                                            >
                                                {uniqueNotes.join(', ')}
                                            </TableCell>
                                        )
                                    }
                                    <TableCell align="right">{row.amount}</TableCell>
                                </TableRow>
                            );
                        }
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function BottomNav(props) {
    const classes = useStyles();
    const {selectedTab, changeTab, remainingPct} = props;

    return (
        <BottomNavigation
            className={classes.stickToBottom}
            value={selectedTab}
            onChange={(event, newValue) => {
                changeTab(newValue);
            }}
            showLabels
        >
            <BottomNavigationAction value="learn" label={`${remainingPct['learn']}%`} icon="Learn"/>
            <BottomNavigationAction value="enjoy" label={`${remainingPct['enjoy']}%`} icon="Ent. / Want"/>
            <BottomNavigationAction value="fuel" label={`${remainingPct['fuel']}%`} icon="Fuel"/>
            <BottomNavigationAction value="grocery" label={`${remainingPct['grocery']}%`} icon="Grocery"/>
        </BottomNavigation>
    );
}

function Main(props) {

    const {ledger, balance, addExpense, groupByFormat, selectedRange} = props;

    const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);

    return (
        <React.Fragment>
            <Grid container alignItems="center" style={{paddingBottom: '56px'}}>
                <Grid item xs={12} sm={6}>
                    <RemainingBalance
                        remainingBudget={balance}
                        showDialog={() => setShowUpdateDialog(true)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Ledger items={ledger} groupByFormat={groupByFormat} selectedRange={selectedRange}/>
                </Grid>
            </Grid>
            <UpdateBalanceDialog
                show={showUpdateDialog}
                hide={() => {
                    setShowUpdateDialog(false);
                }}
                addExpense={addExpense}
            />
        </React.Fragment>
    );
}

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'learn', // learn, enjoy, fuel, grocery
            selectedRange: 'week', // week, month, year
            ledgers: {
                learn: [
                    {date: new Date('2020-03-02'), amount: -31, note: 'food'},
                    {date: new Date('2020-03-03'), amount: -3, note: 'food'},
                    {date: new Date('2020-03-03'), amount: -8, note: 'drink'},
                    {date: new Date('2020-01-07'), amount: -38}
                ],
                enjoy: [],
                fuel: [],
                grocery: [],
            },
            budgets: {
                learn: 100,
                enjoy: 200,
                fuel: 300,
                grocery: 400,
            },
        }
    }

    addExpense(amount, category, note) {

        const {ledgers} = this.state;

        // If category does not exist, it's no-op
        if (!ledgers[category]) {
            console.warn('Unknown category');
            return;
        }

        // amount should be a number
        if (isNaN(amount)) {
            console.warn('amount must be a number');
            return;
        }

        const newEntry = {
            date: new Date(),
            amount: amount,
            category,
            note,
        };

        this.setState({
            ledgers: {
                ...ledgers,
                [category]: [...ledgers[category], newEntry]
            },
        });
    }

    filterLedgerByRange(ledgers, range) {
        let currentRange;
        let currentRangeFormat;
        switch (range) {
            case 'week':
                currentRangeFormat = 'w';
                currentRange = moment().format(currentRangeFormat);
                break;
            case 'month':
                currentRangeFormat = 'M';
                currentRange = moment().format(currentRangeFormat);
                break;
            case 'year':
                currentRangeFormat = 'Y';
                currentRange = moment().format(currentRangeFormat);
                break;
            default:
                currentRangeFormat = '';
                currentRange = '';
                console.warn('Unknown range, balances will show 0');
                break;
        }

        const filteredLedgers = {};

        for (let [category, ledger] of Object.entries(ledgers)) {
            filteredLedgers[category] = ledger.filter(v => {
                return moment(v.date).format(currentRangeFormat) === currentRange;
            });
        }

        return filteredLedgers;
    }

    sumLedgerAmounts(ledger) {
        return ledger.reduce((acc, v) => {
            return acc + v.amount;
        }, 0);
    }

    render() {
        const {ledgers, budgets, selectedTab, selectedRange} = this.state;

        let rangeMultiplier;
        let groupByFormat;
        switch (selectedRange) {
            case 'week':
                rangeMultiplier = 1;
                groupByFormat = 'dddd';
                break;
            case 'month':
                rangeMultiplier = 4;
                groupByFormat = 'Do';
                break;
            case 'year':
                rangeMultiplier = 52;
                groupByFormat = 'MMMM';
                break;
            default:
                rangeMultiplier = 0;
                groupByFormat = '';
                console.warn('Unknown range, balances will show 0');
                break;
        }

        const filteredLedgers = this.filterLedgerByRange(ledgers, selectedRange);

        const balances = {};
        for (let [category, budget] of Object.entries(budgets)) {
            const sum = this.sumLedgerAmounts(filteredLedgers[category]);
            balances[category] = (rangeMultiplier * budget) + sum;
        }

        const remainingPct = {};
        for (let [category, budget] of Object.entries(budgets)) {
            remainingPct[category] = Math.floor(balances[category] / (budget * rangeMultiplier) * 100);
        }

        const lowBalanceRanges = [];
        for (let range of ['week', 'month', 'year']) {
            let rangeMultiplier;
            switch (range) {
                case 'week':
                    rangeMultiplier = 1;
                    break;
                case 'month':
                    rangeMultiplier = 4;
                    break;
                case 'year':
                    rangeMultiplier = 52;
                    break;
                default:
                    rangeMultiplier = 0;
                    console.warn('Invalid range');
            }
            const filteredLedgers = this.filterLedgerByRange(ledgers, range);
            const sum = this.sumLedgerAmounts(filteredLedgers[selectedTab]);
            if (((rangeMultiplier * budgets[selectedTab]) + sum) < 0) {
                lowBalanceRanges.push(range);
            }
        }

        return (
            <React.Fragment>
                <TopBar
                    lowBalanceRanges={lowBalanceRanges}
                    selectedRange={selectedRange}
                    setDateRange={range => this.setState({selectedRange: range})}
                />
                <Main
                    ledger={filteredLedgers[selectedTab]}
                    balance={balances[selectedTab]}
                    groupByFormat={groupByFormat}
                    selectedRange={selectedRange}
                    addExpense={(amount, note) => this.addExpense(amount, selectedTab, note)}
                />
                <BottomNav
                    remainingPct={remainingPct}
                    selectedTab={selectedTab}
                    changeTab={newTab => this.setState({selectedTab: newTab})}/>
            </React.Fragment>
        )
    }
}

export default App;
