export const initialUsers = [
  {
    id: 'USR-01',
    name: 'Dr. Alok Verma',
    username: 'alok.admin',
    email: 'admin@college.edu',
    role: 'Admin',
    department: 'Campus Infrastructure & Maintenance Dept',
    avatar: '👨‍💼',
    title: 'Chief Facilities Director'
  },
  {
    id: 'USR-02',
    name: 'Anil Kumar',
    username: 'anil.tech',
    email: 'anil.av@college.edu',
    role: 'Technician',
    department: 'AV & Electrical Maintenance Team',
    avatar: '🛠️',
    title: 'Senior AV & HVAC Specialist'
  },
  {
    id: 'USR-03',
    name: 'Electrician Mohan',
    username: 'mohan.tech',
    email: 'mohan.elec@college.edu',
    role: 'Technician',
    department: 'Electrical Department',
    avatar: '⚡',
    title: 'Master Electrician'
  },
  {
    id: 'USR-04',
    name: 'Prof. Ramesh Sharma',
    username: 'ramesh.faculty',
    email: 'ramesh.cs@college.edu',
    role: 'Faculty',
    department: 'Computer Science & Engineering',
    avatar: '👨‍🏫',
    title: 'HOD - Computer Science'
  },
  {
    id: 'USR-05',
    name: 'Aarav Patel',
    username: 'aarav.student',
    email: 'aarav.student@college.edu',
    role: 'Student',
    department: 'B.Tech CS (Final Year)',
    avatar: '🎓',
    title: 'Student Representative'
  }
];

export const initialRooms = [
  { id: 'R301', number: '301', type: 'Classroom', block: 'Science Block', floor: '3rd Floor', capacity: 60 },
  { id: 'R302', number: '302', type: 'Classroom', block: 'Science Block', floor: '3rd Floor', capacity: 60 },
  { id: 'R303', number: '303', type: 'Classroom', block: 'Science Block', floor: '3rd Floor', capacity: 50 },
  { id: 'LAB101', number: 'Lab 101', type: 'Computer Lab', block: 'IT Block', floor: '1st Floor', capacity: 40 },
  { id: 'LAB202', number: 'Lab 202', type: 'Electronics Lab', block: 'Engineering Wing', floor: '2nd Floor', capacity: 35 },
  { id: 'SEM401', number: 'Seminar Hall 401', type: 'Seminar Hall', block: 'Main Admin', floor: '4th Floor', capacity: 150 },
  { id: 'AUD-A', number: 'Auditorium A', type: 'Auditorium', block: 'Cultural Complex', floor: 'Ground Floor', capacity: 500 }
];

export const initialEquipment = [
  // Room 302 Items
  { id: 'EQ-302-PJ', roomNumber: '302', type: 'Projector', name: 'Epson HD Ceiling Projector', serial: 'EPS-9028', installedDate: '2023-08-15', status: 'Under Repair' },
  { id: 'EQ-302-AC1', roomNumber: '302', type: 'AC', name: 'Daikin 2 Ton Split AC', serial: 'DK-302A', installedDate: '2022-04-10', status: 'Operational' },
  { id: 'EQ-302-AC2', roomNumber: '302', type: 'AC', name: 'Daikin 2 Ton Split AC', serial: 'DK-302B', installedDate: '2022-04-10', status: 'Operational' },
  { id: 'EQ-302-FN', roomNumber: '302', type: 'Fan', name: 'High Speed Ceiling Fan (Qty 4)', serial: 'FN-302-SET', installedDate: '2021-01-20', status: 'Operational' },
  { id: 'EQ-302-BN', roomNumber: '302', type: 'Bench', name: 'Wooden Dual Desk Benches (Qty 30)', serial: 'BN-302-SET', installedDate: '2021-01-20', status: 'Operational' },
  { id: 'EQ-302-EL', roomNumber: '302', type: 'Electrical', name: 'Main Power Distribution Switchboard', serial: 'EL-302-SW', installedDate: '2021-01-20', status: 'Needs Service' },

  // Room 301 Items
  { id: 'EQ-301-PJ', roomNumber: '301', type: 'Projector', name: 'BenQ Interactive Short Throw', serial: 'BNQ-4410', installedDate: '2023-01-12', status: 'Operational' },
  { id: 'EQ-301-AC1', roomNumber: '301', type: 'AC', name: 'Voltas 1.5 Ton AC', serial: 'VLT-301', installedDate: '2022-05-18', status: 'Operational' },
  { id: 'EQ-301-BN', roomNumber: '301', type: 'Bench', name: 'Ergonomic Student Chairs (Qty 60)', serial: 'BN-301-SET', installedDate: '2022-05-18', status: 'Operational' },

  // Computer Lab 101 Items
  { id: 'EQ-LAB101-PC', roomNumber: 'Lab 101', type: 'Computer', name: 'Dell OptiPlex Core i7 Workstations (Qty 40)', serial: 'DELL-LAB1-SET', installedDate: '2023-09-01', status: 'Operational' },
  { id: 'EQ-LAB101-AC', roomNumber: 'Lab 101', type: 'AC', name: 'Central Ducting AC Unit', serial: 'HVAC-LAB1', installedDate: '2021-11-05', status: 'Under Repair' },
  { id: 'EQ-LAB101-PJ', roomNumber: 'Lab 101', type: 'Projector', name: 'Sony Laser Presentation Projector', serial: 'SNY-LAB1', installedDate: '2023-09-01', status: 'Operational' },

  // Electronics Lab 202 Items
  { id: 'EQ-LAB202-EL', roomNumber: 'Lab 202', type: 'Electrical', name: 'Digital Oscilloscope & Power Rig Bench', serial: 'RIG-202-SET', installedDate: '2022-02-14', status: 'Out of Order' },
  { id: 'EQ-LAB202-FN', roomNumber: 'Lab 202', type: 'Fan', name: 'Exhaust & Ceiling Ventilation Unit', serial: 'EXH-202', installedDate: '2021-03-30', status: 'Operational' },

  // Seminar Hall 401
  { id: 'EQ-SEM401-PJ', roomNumber: 'Seminar Hall 401', type: 'Projector', name: 'Panasonic 4K Auditorium Projector', serial: 'PNS-4K', installedDate: '2024-02-10', status: 'Operational' },
  { id: 'EQ-SEM401-AC', roomNumber: 'Seminar Hall 401', type: 'AC', name: 'Carrier Commercial Packaged AC', serial: 'CRR-401', installedDate: '2024-02-10', status: 'Operational' }
];

export const initialIssues = [
  {
    id: 'TKT-1001',
    roomNumber: '302',
    equipmentType: 'Projector',
    equipmentId: 'EQ-302-PJ',
    equipmentName: 'Epson HD Ceiling Projector',
    issue: 'No display',
    description: 'Projector turns on power LED blue but does not throw display output onto the whiteboard. Lamp error indicator blinking red.',
    status: 'Under repair',
    priority: 'High',
    reportedBy: 'Prof. Ramesh Sharma',
    reportedAt: '2026-09-09 09:30 AM',
    assignedTechnician: 'Anil Kumar',
    estimatedCost: '₹3,500',
    updates: [
      { timestamp: '2026-09-09 09:30 AM', text: 'Issue reported by Prof. Ramesh Sharma.' },
      { timestamp: '2026-09-09 11:15 AM', text: 'Assigned to Senior AV Specialist Anil Kumar.' },
      { timestamp: '2026-09-09 02:00 PM', text: 'Status changed to Under repair. Replacement HDMI controller card ordered.' }
    ]
  },
  {
    id: 'TKT-1002',
    roomNumber: 'Lab 101',
    equipmentType: 'AC',
    equipmentId: 'EQ-LAB101-AC',
    equipmentName: 'Central Ducting AC Unit',
    issue: 'Water leakage & weak cooling',
    description: 'Condensation pipe blocked resulting in water dripping near PC Workstations 12-14. Immediate fix needed.',
    status: 'Under repair',
    priority: 'Urgent',
    reportedBy: 'Dr. Priya Nair',
    reportedAt: '2026-09-08 02:15 PM',
    assignedTechnician: 'Anil Kumar',
    estimatedCost: '₹1,800',
    updates: [
      { timestamp: '2026-09-08 02:15 PM', text: 'Ticket logged under Urgent priority due to liquid near electrical PCs.' },
      { timestamp: '2026-09-08 03:00 PM', text: 'Technician inspected. Drainage pipe unblocking in progress.' }
    ]
  },
  {
    id: 'TKT-1003',
    roomNumber: 'Lab 202',
    equipmentType: 'Electrical',
    equipmentId: 'EQ-LAB202-EL',
    equipmentName: 'Digital Oscilloscope & Power Rig Bench',
    issue: 'Tripping MCB breaker on power-up',
    description: 'Bench #3 main switch trips the laboratory MCB board whenever oscilloscope transformer is switched on.',
    status: 'Reported',
    priority: 'Medium',
    reportedBy: 'Electrician Mohan',
    reportedAt: '2026-09-09 10:45 AM',
    assignedTechnician: 'Electrician Mohan',
    estimatedCost: 'Pending Assessment',
    updates: [
      { timestamp: '2026-09-09 10:45 AM', text: 'Issue submitted into admin queue.' }
    ]
  },
  {
    id: 'TKT-1004',
    roomNumber: '302',
    equipmentType: 'Electrical',
    equipmentId: 'EQ-302-EL',
    equipmentName: 'Main Power Distribution Switchboard',
    issue: 'Flickering switch socket',
    description: 'Switch #4 for front ceiling fan emits sparking noise when turned on.',
    status: 'Reported',
    priority: 'High',
    reportedBy: 'Staff Caretaker Rajesh',
    reportedAt: '2026-09-09 11:30 AM',
    assignedTechnician: 'Unassigned',
    estimatedCost: 'Pending Assessment',
    updates: [
      { timestamp: '2026-09-09 11:30 AM', text: 'Issue logged by facilities team.' }
    ]
  },
  {
    id: 'TKT-1005',
    roomNumber: '301',
    equipmentType: 'Fan',
    equipmentId: 'EQ-301-FN-OLD',
    equipmentName: 'Ceiling Fan #2',
    issue: 'Noisy bearing sound',
    description: 'Fan makes loud grinding noise at speed setting 4.',
    status: 'Resolved',
    priority: 'Low',
    reportedBy: 'Prof. Ramesh Sharma',
    reportedAt: '2026-09-05 08:00 AM',
    assignedTechnician: 'Electrician Mohan',
    estimatedCost: '₹400',
    updates: [
      { timestamp: '2026-09-05 08:00 AM', text: 'Issue logged.' },
      { timestamp: '2026-09-05 04:00 PM', text: 'Ball bearings lubricated & motor aligned. Issue resolved.' }
    ]
  }
];
