import express from 'express';
import cors from 'cors';
import { initialUsers, initialRooms, initialEquipment, initialIssues } from './data/initialData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Data stores
let users = [...initialUsers];
let rooms = [...initialRooms];
let equipment = [...initialEquipment];
let issues = [...initialIssues];

// --- AUTH & USER ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'College Facility Backend API' });
});

// GET all demo users
app.get('/api/users', (req, res) => {
  res.json(users.map(({ password, ...user }) => user));
});

// Username-based sign in. Demo accounts use the password: campus123.
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const normalizedUsername = username?.trim().toLowerCase();
  const user = users.find(u => u.username?.toLowerCase() === normalizedUsername);
  
  if (user && (user.password || 'campus123') === password) {
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser, token: `mock-token-${user.id}` });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect username or password.' });
  }
});

// POST sign up - email is intentionally not collected or required.
app.post('/api/auth/signup', (req, res) => {
  const { name, username, password, role = 'Student', department = '' } = req.body;
  const cleanName = name?.trim();
  const cleanUsername = username?.trim().toLowerCase();

  if (!cleanName || !cleanUsername || !password) {
    return res.status(400).json({ success: false, message: 'Name, username, and password are required.' });
  }
  if (!/^[a-z0-9._-]{3,24}$/.test(cleanUsername)) {
    return res.status(400).json({ success: false, message: 'Username must be 3–24 characters and use letters, numbers, dots, dashes, or underscores.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }
  if (users.some(u => u.username?.toLowerCase() === cleanUsername)) {
    return res.status(409).json({ success: false, message: 'That username is already in use.' });
  }

  const allowedRoles = ['Admin', 'Technician', 'Faculty', 'Student'];
  const assignedRole = allowedRoles.includes(role) ? role : 'Student';
  const avatarByRole = { Admin: '👨‍💼', Technician: '🛠️', Faculty: '👨‍🏫', Student: '🎓' };
  const user = {
    id: `USR-${String(users.length + 1).padStart(2, '0')}`,
    name: cleanName,
    username: cleanUsername,
    password,
    role: assignedRole,
    department: department.trim() || 'Campus Community',
    avatar: avatarByRole[assignedRole],
    title: assignedRole === 'Student' ? 'Campus Member' : `${assignedRole} Member`
  };
  users.push(user);
  const { password: _, ...safeUser } = user;
  res.status(201).json({ success: true, user: safeUser, token: `mock-token-${user.id}` });
});

// --- FACILITY & ISSUE ENDPOINTS ---

app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

app.get('/api/equipment', (req, res) => {
  res.json(equipment);
});

app.get('/api/issues', (req, res) => {
  const { status, technician, reportedBy } = req.query;
  let result = [...issues];

  if (status === 'unresolved') {
    result = result.filter(i => i.status !== 'Resolved' && i.status !== 'Closed');
  } else if (status) {
    result = result.filter(i => i.status?.toLowerCase() === status.toLowerCase());
  }

  if (technician) {
    result = result.filter(i => i.assignedTechnician?.toLowerCase().includes(technician.toLowerCase()));
  }

  if (reportedBy) {
    result = result.filter(i => i.reportedBy?.toLowerCase().includes(reportedBy.toLowerCase()));
  }

  res.json(result);
});

app.post('/api/issues', (req, res) => {
  const { roomNumber, equipmentType, equipmentId, equipmentName, issueTitle, description, priority, reportedBy } = req.body;

  const nowStr = new Date().toLocaleString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  const newIssue = {
    id: `TKT-${1000 + issues.length + 1}`,
    roomNumber,
    equipmentType,
    equipmentId: equipmentId || 'CUSTOM-EQ',
    equipmentName: equipmentName || `${equipmentType} (Room ${roomNumber})`,
    issue: issueTitle,
    description,
    status: 'Reported',
    priority: priority || 'Medium',
    reportedBy: reportedBy || 'Faculty / Staff',
    reportedAt: nowStr,
    assignedTechnician: 'Unassigned',
    estimatedCost: 'Pending Assessment',
    updates: [
      { timestamp: nowStr, text: `Issue reported by ${reportedBy || 'Faculty/Staff'}.` }
    ]
  };

  issues.unshift(newIssue);

  if (equipmentId) {
    equipment = equipment.map(item => item.id === equipmentId ? { ...item, status: 'Needs Service' } : item);
  }

  res.status(201).json({ message: 'Issue logged successfully', issue: newIssue });
});

app.patch('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const { status, technician, note } = req.body;

  const issueIndex = issues.findIndex(i => i.id === id);
  if (issueIndex === -1) {
    return res.status(404).json({ error: 'Issue ticket not found' });
  }

  const nowStr = new Date().toLocaleString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  const currentIssue = issues[issueIndex];
  const updatedTech = technician !== undefined && technician !== null ? technician : currentIssue.assignedTechnician;

  const newUpdate = {
    timestamp: nowStr,
    text: `Status changed to "${status}"${technician ? `. Assigned to: ${technician}` : ''}${note ? `. Note: ${note}` : ''}.`
  };

  const updatedIssue = {
    ...currentIssue,
    status: status || currentIssue.status,
    assignedTechnician: updatedTech,
    updates: [newUpdate, ...currentIssue.updates]
  };

  issues[issueIndex] = updatedIssue;

  if (currentIssue.equipmentId) {
    let eqStatus = 'Operational';
    if (status === 'Under repair' || status === 'In Progress') eqStatus = 'Under Repair';
    else if (status === 'Reported') eqStatus = 'Needs Service';

    equipment = equipment.map(eq => eq.id === currentIssue.equipmentId ? { ...eq, status: eqStatus } : eq);
  }

  res.json({ message: 'Issue updated', issue: updatedIssue });
});

app.post('/api/reset', (req, res) => {
  users = [...initialUsers];
  rooms = [...initialRooms];
  equipment = [...initialEquipment];
  issues = [...initialIssues];
  res.json({ message: 'Database reset to initial seed state' });
});

app.listen(PORT, () => {
  console.log(`🚀 College Facility Backend Server running on http://localhost:${PORT}`);
});
