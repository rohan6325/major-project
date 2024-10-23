import * as React from 'react';
import { TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { Button, Box, Typography, Container, Paper } from '@mui/material';
import dayjs from 'dayjs';

export default function ElectionForm() {
  const [electionTitle, setElectionTitle] = React.useState('');
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      electionTitle,
      startDate: startDate.format(),
      endDate: endDate.format()
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 2 } }}>
          <Typography variant="h4" gutterBottom>
            Election Title
          </Typography>
          
          <TextField
            fullWidth
            label="Add a title here"
            variant="outlined"
            value={electionTitle}
            onChange={(e) => setElectionTitle(e.target.value)}
            sx={{ mb: 4 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker
                label="Start Date and Time"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                sx={{ width: '100%' }}
              />
            </DemoContainer>

            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker
                label="End Date and Time"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                sx={{ width: '100%' }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              bgcolor: '#dc2626', // red-600
              '&:hover': {
                bgcolor: '#b91c1c', // red-700
              },
              py: 1.5,
            }}
          >
            Conduct Election
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}