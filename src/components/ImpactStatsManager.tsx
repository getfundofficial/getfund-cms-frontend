import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://getfund-cms-backend.vercel.app/api';

export default function ImpactStatsManager() {
  const [stats, setStats] = useState([]);
  const [subtitle, setSubtitle] = useState('');
  const [selectedPage, setSelectedPage] = useState('all');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    color: 'primary',
    page: 'all',
    order_number: 999,
  });

  useEffect(() => {
    fetchStats();
  }, [selectedPage]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/impact-stats?page=${selectedPage}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.stats || []);
        setSubtitle(data.data.subtitle || '');
      }
    } catch (err) {
      setError('Failed to fetch impact stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (stat = null) => {
    if (stat) {
      setEditingStat(stat);
      setFormData({
        title: stat.title,
        value: stat.value,
        color: stat.color,
        page: stat.page,
        order_number: stat.order_number,
      });
    } else {
      setEditingStat(null);
      setFormData({
        title: '',
        value: '',
        color: 'primary',
        page: selectedPage,
        order_number: stats.length + 1,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStat(null);
    setFormData({
      title: '',
      value: '',
      color: 'primary',
      page: 'all',
      order_number: 999,
    });
  };

  const handleSave = async () => {
    try {
      setError('');
      
      const url = editingStat
        ? `${API_BASE_URL}/impact-stats/${editingStat.id}`
        : `${API_BASE_URL}/impact-stats`;
      
      const method = editingStat ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(editingStat ? 'Stat updated successfully' : 'Stat created successfully');
        fetchStats();
        handleCloseDialog();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save stat');
      }
    } catch (err) {
      setError('Failed to save stat');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/impact-stats/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Stat deleted successfully');
        fetchStats();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete stat');
      }
    } catch (err) {
      setError('Failed to delete stat');
      console.error(err);
    }
  };

  const handleUpdateSubtitle = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/impact-stats/subtitle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: selectedPage, subtitle }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Subtitle updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update subtitle');
      }
    } catch (err) {
      setError('Failed to update subtitle');
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Impact Stats Manager</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Stat
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Page Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Page</InputLabel>
                <Select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  label="Filter by Page"
                >
                  <MenuItem value="all">All Pages</MenuItem>
                  <MenuItem value="why-fundraising">Why Fundraising</MenuItem>
                  <MenuItem value="ways-to-donate">Ways to Donate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="25+ years of giving"
                helperText="Subtitle displayed below 'Our Impact'"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleUpdateSubtitle}
              >
                Save Subtitle
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="50">Order</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Page</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No stats found. Click "Add New Stat" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                stats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DragIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        {stat.order_number}
                      </Box>
                    </TableCell>
                    <TableCell>{stat.title}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {stat.value}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 1,
                          bgcolor: stat.color.startsWith('#') ? stat.color : `${stat.color}.main`,
                        }}
                      />
                    </TableCell>
                    <TableCell>{stat.page}</TableCell>
                    <TableCell>
                      {stat.is_active ? (
                        <Typography color="success.main">Active</Typography>
                      ) : (
                        <Typography color="error.main">Inactive</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(stat)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(stat.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingStat ? 'Edit Stat' : 'Add New Stat'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Scholarships awarded"
                  helperText={`${formData.title.length}/100 characters`}
                  inputProps={{ maxLength: 100 }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="5,000+"
                  helperText={`${formData.value.length}/50 characters`}
                  inputProps={{ maxLength: 50 }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Color</InputLabel>
                  <Select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    label="Color"
                  >
                    <MenuItem value="primary">Green (Primary)</MenuItem>
                    <MenuItem value="gold">Gold</MenuItem>
                    <MenuItem value="orange">Orange</MenuItem>
                    <MenuItem value="teal">Teal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Page</InputLabel>
                  <Select
                    value={formData.page}
                    onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                    label="Page"
                  >
                    <MenuItem value="all">All Pages</MenuItem>
                    <MenuItem value="why-fundraising">Why Fundraising</MenuItem>
                    <MenuItem value="ways-to-donate">Ways to Donate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Display Order"
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: parseInt(e.target.value) })}
                  helperText="Lower numbers appear first"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={!formData.title || !formData.value}
          >
            {editingStat ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
