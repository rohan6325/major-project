import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
            Create Election
          </Typography>
          
          <TextField
            fullWidth
            label="Election Title"
            variant="outlined"
            value={electionTitle}
            onChange={(e) => setElectionTitle(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            </Box>
          </LocalizationProvider>

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500
            }}
          >
            Conduct Election
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}