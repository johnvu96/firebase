import { Button, Card, CardActions, CardContent, CircularProgress, Divider, Grid, makeStyles, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useEffect, useState } from 'react';
import { authMiddleWare } from '../util/auth';
import axios from 'axios';
import { HOST } from '../config/host';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    root: {},
    details: {
        display: 'flex'
    },
    avatar: {
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0
    },
    locationText: {
        paddingLeft: '15px'
    },
    buttonProperty: {
        position: 'absolute',
        top: '50%'
    },
    uiProgess: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    progess: {
        position: 'absolute'
    },
    uploadButton: {
        marginLeft: '8px',
        margin: theme.spacing(1)
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    submitButton: {
        marginTop: '10px'
    }
}))

function Account() {
    const classes = useStyles();
    const history = useHistory();
    const authToken = localStorage.getItem('AuthToken');
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        country: '',
        username: '',
    });
    const [image, setImage] = useState(undefined);
    const [imageError, setImageError] = useState(false);

    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    const fetchData = () => {
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
                    email: res.data.userCredentials.email,
                    phoneNumber: res.data.userCredentials.phoneNumber,
                    country: res.data.userCredentials.country,
                    username: res.data.userCredentials.username,
                });
                setUiLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    history.push('/login')
                }
                this.setState({ errorMsg: 'Error in retrieving the data' });
            });
    }

    const handleChange = e => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        })
    }

    const updateFormValues = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        authMiddleWare(history);

        const formReq = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            country: userData.country
        }
        axios({
            url: `${HOST}/user`,
            method: 'POST',
            headers: {
                Authorization: authToken,
            },
            data: formReq,
        })
        .then(() => {
            setButtonLoading(false);
            window.location.reload();
        })
        .catch(err => {
            if(err.response.status === 403){
                history.push('/login');
            }
            console.log(err);
            setButtonLoading(false);
        })
    }

    const handleImageChange = e => {
        setImage(e.target.files[0]);
    }
    const profilePictureHandler = e => {
        e.preventDefault();
        setUiLoading(true);
        authMiddleWare();

        let form_data = new FormData();
        form_data.append('image', image);
        axios({
            url: `${HOST}/user/image`,
            method: 'POST',
            headers: {
                Authorization: authToken,
                'content-type': 'application/json; charset=utf-8'
            },
            data: form_data
        })
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            if (error.response.status === 403) {
                history.push('/login');
            }
            console.log(error);
            setUiLoading(false);
            setImageError('Error in posting the data');
        });
    }
    useEffect(() => {
        authMiddleWare(history);
        fetchData();
    }, []);

    if (uiLoading) return (
        <div className={classes.root}>
            {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
        </div>
    );
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Card className={classes.root}>
                <CardContent>
                    <div className={classes.details}>
                        <div>
                            <Typography className={classes.locationText} gutterBottom variant="h4">
                                {userData.firstName} {userData.lastName}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                type="submit"
                                size="small"
                                startIcon={<CloudUploadIcon />}
                                className={classes.uploadButton}
                                onClick={profilePictureHandler}
                            >
                                Upload Photo
									</Button>
                            <input type="file" 
                            onChange={handleImageChange} 
                            />

                            {imageError ? (
                                <div className={classes.customError}>
                                    {' '}
											Wrong Image Format || Supported Format are PNG and JPG
                                </div>
                            ) : (
                                    false
                                )}
                        </div>
                    </div>
                    <div className={classes.progress} />
                </CardContent>
                <Divider />
            </Card>

            <br />
            <Card className={classes.root}>
                <form autoComplete="off" noValidate>
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label="First name"
                                    margin="dense"
                                    name="firstName"
                                    variant="outlined"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Last name"
                                    margin="dense"
                                    name="lastName"
                                    variant="outlined"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    margin="dense"
                                    name="email"
                                    variant="outlined"
                                    disabled={true}
                                    value={userData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    margin="dense"
                                    name="phone"
                                    type="number"
                                    variant="outlined"
                                    disabled={true}
                                    value={userData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label="User Name"
                                    margin="dense"
                                    name="userHandle"
                                    disabled={true}
                                    variant="outlined"
                                    value={userData.username}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    margin="dense"
                                    name="country"
                                    variant="outlined"
                                    value={userData.country}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions />
                </form>
            </Card>
            <Button
                color="primary"
                variant="contained"
                type="submit"
                className={classes.submitButton}
                onClick={updateFormValues}
                disabled={
                    buttonLoading ||
                    !userData.firstName ||
                    !userData.lastName ||
                    !userData.country
                }
            >
                Save details
						{/* {buttonLoading && <CircularProgress size={30} className={classes.progess} />} */}
            </Button>
        </main>
    );
}

export default Account;