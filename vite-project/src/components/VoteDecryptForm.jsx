import { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Paper
} from '@mui/material';

const VoteDecryptForm = () => {
  const [encryptedVote, setEncryptedVote] = useState('');
  const [electionId, setElectionId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Basic validation
      if (!encryptedVote.trim() || !electionId.trim()) {
        throw new Error('Please fill in all fields');
      }

      // Try to parse the encrypted vote to ensure it's valid JSON
      try {
        JSON.parse(encryptedVote);
      } catch {
        throw new Error('Invalid encrypted vote format. Please ensure it is valid JSON');
      }

      const response = await fetch(`${serverUrl}//api/vote/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encrypted_vote: encryptedVote,
          election_id: electionId,
        }),
      });

      const responseText = await response.text(); // Get raw response text first
      
      // Log raw response for debugging
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Server returned invalid JSON response' + e);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to decrypt vote');
      }

      setResult(data);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardHeader 
        title={
          <Typography variant="h5" component="h2">
            Decrypt Vote
          </Typography>
        }
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              id="electionId"
              label="Election ID"
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
              placeholder="Enter election ID"
              required
              fullWidth
              error={!!error && !electionId.trim()}
              helperText={!!error && !electionId.trim() ? 'Election ID is required' : ''}
            />

            <TextField
              id="encryptedVote"
              label="Encrypted Vote"
              value={encryptedVote}
              onChange={(e) => setEncryptedVote(e.target.value)}
              placeholder="Paste encrypted vote data here"
              required
              fullWidth
              multiline
              rows={4}
              error={!!error && !encryptedVote.trim()}
              helperText={!!error && !encryptedVote.trim() ? 'Encrypted vote is required' : ''}
            />

            <Button 
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Decrypting...
                </Box>
              ) : (
                'Decrypt Vote'
              )}
            </Button>
          </Box>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Decryption Result</Typography>
            
            {result.selected_candidate && (
              <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Selected Candidate:
                </Typography>
                <Typography>
                  Name: {result.selected_candidate.name}
                </Typography>
                <Typography>
                  Party: {result.selected_candidate.party}
                </Typography>
              </Paper>
            )}
            
            <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Vote Vector:
              </Typography>
              <Box 
                component="pre"
                sx={{ 
                  mt: 1, 
                  overflowX: 'auto',
                  fontSize: '0.875rem'
                }}
              >
                {JSON.stringify(result.decrypted_vector, null, 2)}
              </Box>
            </Paper>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default VoteDecryptForm;