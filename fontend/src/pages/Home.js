import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Account from '../components/Account';
import Todo from '../components/Todo';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authMiddleWare } from '../util/auth'
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { HOST } from '../config/host';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    avatar: {
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0,
        marginTop: 20
    },
    uiProgess: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    toolbar: theme.mixins.toolbar
}));

function Home() {
    const classes = useStyles();
    const history = useHistory();

    const [render, setRender] = useState(false);
    const [uiLoading, setUiLoading] = useState(true);

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        profilePicture: '',
    });

    const loadAccountPage = (event) => {
		setRender(true);
	};

	const loadTodoPage = (event) => {
		setRender(false);
	};

	const logoutHandler = (event) => {
		localStorage.removeItem('AuthToken');
		history.push('/login');
	};

    const fetchData = () => {
        const authToken = localStorage.getItem('AuthToken');
        
        axios({
            method: 'GET',
            url: `${HOST}/user`,
            headers: {
                Authorization: authToken,
            },
        })
            .then((res) => {
                setUserData({
                    ...userData,
                    firstName: res.data.userCredentials.firstName,
                    lastName: res.data.userCredentials.lastName,
                    profilePicture: res.data.userCredentials.imageUrl,
                });
                setUiLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    history.push('/login')
                }
                console.log(error);
                // this.setState({ errorMsg: 'Error in retrieving the data' });
            });
    }

    useEffect(() => {
        authMiddleWare(history);
        fetchData();
    }, [])

    if (uiLoading) return (
        <div className={classes.root}>
            {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
        </div>
    );

    
    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        TodoApp
							</Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <div className={classes.toolbar} />
                <Divider />
                <center>
                    <Avatar src={userData.profilePicture} className={classes.avatar} />
                    <p>
                        {' '}
                        {userData.firstName} {userData.lastName}
                    </p>
                </center>
                <Divider />
                <List>
                    <ListItem button key="Todo" onClick={loadTodoPage}>
                        <ListItemIcon>
                            {' '}
                            <NotesIcon />{' '}
                        </ListItemIcon>
                        <ListItemText primary="Todo" />
                    </ListItem>

                    <ListItem button key="Account" onClick={loadAccountPage}>
                        <ListItemIcon>
                            {' '}
                            <AccountBoxIcon />{' '}
                        </ListItemIcon>
                        <ListItemText primary="Account" />
                    </ListItem>

                    <ListItem button key="Logout" onClick={logoutHandler}>
                        <ListItemIcon>
                            {' '}
                            <ExitToAppIcon />{' '}
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
            <div>{render ? <Account /> : <Todo />}</div>
        </div>
    );
}

export default Home;