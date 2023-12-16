import React from 'react';
import { Container, Typography, Grid, Paper, Divider } from '@mui/material';

function AboutPage() {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={6} sx={{ padding: 20 }}>
                <Grid container>
                    <Typography variant="h4" gutterBottom>
                        About the project
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{mt: 1, mb: 1}}>
                                The project is created for education purposes in scope of PRO subject
                            </Typography>
                            <Typography variant="body1">
                                Back end: .NET Core Web API
                            </Typography>
                            <Typography variant="body1">
                                Database: MSSQL
                            </Typography>
                            <Typography variant="body1" >
                                Front end: React-Typescript, MUI
                            </Typography>
                            <Typography variant="body1" sx={{mt: 2, mb: 1}}>
                                The projects purpose - solving a set of common problems in corporate environment. 
                            </Typography>
                            <Typography variant="body1" sx={{mt: 1, mb: 1}}>
                                First of the mentioned problems is - corporate marketplace.
                            </Typography>
                            <Typography variant="body1" sx={{mt: 1, mb: 1}}>
                                Second of the mentioned problems is - training framework.
                            </Typography>
                            
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default AboutPage;
