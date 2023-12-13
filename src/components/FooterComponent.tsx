import { Container, Grid, Typography } from '@mui/material';

export default function FooterComponent() {

    return (
        <Container component="footer" maxWidth="xl" sx={{py: 3 }}>
            <Grid container justifyContent="center">
                <Grid item>
                    <Typography variant="body2" align="center">
                        © {new Date().getFullYear()} PRO 3
                    </Typography>
                    <Typography variant="body2" align="center">
                        Contact: s17511@pjwstk.edu.pl
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
}
