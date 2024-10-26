import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import dayjs from 'dayjs';

export default function ElectionForm() {
  const [electionTitle, setElectionTitle] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [errorMessage, setErrorMessage] = useState(null);
  const [ongoingElection, setOngoingElection] = useState(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // Check for ongoing election
  useEffect(() => {
    const fetchOngoingElection = async () => {
      const electionId = localStorage.getItem("election_id");
      if (electionId) {
        try {
          const response = await fetch(`${serverUrl}/api/election/${electionId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch election details');
          }
          const electionData = await response.json();
          const now = dayjs();
          if (now.isBefore(dayjs(electionData.end_time))) {
            setOngoingElection(electionData);
          }
        } catch (error) {
          console.error('Error fetching ongoing election:', error);
        }
      }
    };

    fetchOngoingElection();
  }, [serverUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const electionData = {
      election_name: electionTitle,
      start_time: startDate.format(),
      end_time: endDate.format(),
    };

    try {
      const response = await fetch(`${serverUrl}/api/election/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(electionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create election');
      }

      const result = await response.json();
      console.log('Election created:', result);
      localStorage.setItem("election_id", result.election_id);

      alert('Election created successfully!');
    } catch (error) {
      console.error('Error creating election:', error);
      setErrorMessage('Failed to create the election. Please try again.');
    }
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

          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {ongoingElection && (
            <Typography variant="body2" color="warning" sx={{ mb: 2 }}>
              Election ongoing: {ongoingElection.election_name} will end on {dayjs(ongoingElection.end_time).format('MMMM D, YYYY h:mm A')}
            </Typography>
          )}

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
            disabled={!!ongoingElection} // Disable input if there's an ongoing election
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
                  disabled={!!ongoingElection} // Disable if there's an ongoing election
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
                  disabled={!!ongoingElection} // Disable if there's an ongoing election
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
            disabled={!!ongoingElection} // Disable button if there's an ongoing election
          >
            Conduct Election
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
