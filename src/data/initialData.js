// Initial realistic demo data for BizFlow Small Business Workflow Management Platform

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatLocalDate(d);
};

export const INITIAL_EMPLOYEES = [
  {
    id: 'emp-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@bizflow.com',
    role: 'Operations Lead',
    department: 'Operations',
    avatarBg: 'bg-blue-600',
    createdAt: getRelativeDate(-90)
  },
  {
    id: 'emp-2',
    name: 'Priya Patel',
    email: 'priya.patel@bizflow.com',
    role: 'Accountant',
    department: 'Finance',
    avatarBg: 'bg-emerald-600',
    createdAt: getRelativeDate(-85)
  },
  {
    id: 'emp-3',
    name: 'Amit Verma',
    email: 'amit.verma@bizflow.com',
    role: 'Sales Representative',
    department: 'Sales',
    avatarBg: 'bg-purple-600',
    createdAt: getRelativeDate(-75)
  },
  {
    id: 'emp-4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@bizflow.com',
    role: 'Inventory Manager',
    department: 'Logistics',
    avatarBg: 'bg-amber-600',
    createdAt: getRelativeDate(-60)
  },
  {
    id: 'emp-5',
    name: 'Vikram Singh',
    email: 'vikram.singh@bizflow.com',
    role: 'Customer Support Executive',
    department: 'Support',
    avatarBg: 'bg-indigo-600',
    createdAt: getRelativeDate(-50)
  },
  {
    id: 'emp-6',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@bizflow.com',
    role: 'Procurement Specialist',
    department: 'Procurement',
    avatarBg: 'bg-pink-600',
    createdAt: getRelativeDate(-40)
  },
  {
    id: 'emp-7',
    name: 'Karan Malhotra',
    email: 'karan.malhotra@bizflow.com',
    role: 'Delivery Coordinator',
    department: 'Logistics',
    avatarBg: 'bg-cyan-600',
    createdAt: getRelativeDate(-30)
  },
  {
    id: 'emp-8',
    name: 'Neha Joshi',
    email: 'neha.joshi@bizflow.com',
    role: 'HR & Admin Assistant',
    department: 'Human Resources',
    avatarBg: 'bg-rose-600',
    createdAt: getRelativeDate(-20)
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-101',
    title: 'Prepare supplier invoice for Q3 inventory',
    description: 'Verify receipt notes against vendor bill #INV-8890 from Zenith Supplies and draft payment authorization.',
    assignedTo: 'emp-2', // Priya Patel
    priority: 'Critical',
    status: 'Pending',
    deadline: getRelativeDate(-3), // Overdue!
    createdAt: getRelativeDate(-7),
    updatedAt: getRelativeDate(-3)
  },
  {
    id: 'task-102',
    title: 'Follow up with VIP customer on pending order #4490',
    description: 'Client expressed concern about delayed shipment of customized office desks. Provide updated tracking link.',
    assignedTo: 'emp-5', // Vikram Singh
    priority: 'High',
    status: 'In Progress',
    deadline: getRelativeDate(-1), // Overdue!
    createdAt: getRelativeDate(-4),
    updatedAt: getRelativeDate(-1)
  },
  {
    id: 'task-103',
    title: 'Update monthly warehouse inventory count',
    description: 'Conduct physical audit of Zone B packaging stock and reconcile with digital inventory counts.',
    assignedTo: 'emp-4', // Sneha Reddy
    priority: 'Medium',
    status: 'Pending',
    deadline: getRelativeDate(-2), // Overdue!
    createdAt: getRelativeDate(-5),
    updatedAt: getRelativeDate(-2)
  },
  {
    id: 'task-104',
    title: 'Process pending wholesale order #8812',
    description: 'Confirm payment receipt from Metro Retailers and dispatch warehouse release order.',
    assignedTo: 'emp-1', // Rahul Sharma
    priority: 'High',
    status: 'In Progress',
    deadline: getRelativeDate(1),
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-1)
  },
  {
    id: 'task-105',
    title: 'Prepare monthly sales and revenue report',
    description: 'Aggregate regional sales totals for September and prepare summary slides for management review.',
    assignedTo: 'emp-3', // Amit Verma
    priority: 'Medium',
    status: 'Completed',
    deadline: getRelativeDate(-4),
    createdAt: getRelativeDate(-10),
    updatedAt: getRelativeDate(-4)
  },
  {
    id: 'task-106',
    title: 'Contact raw material vendor for price negotiation',
    description: 'Inquire about bulk discount rates on steel framing materials for upcoming Q4 batch production.',
    assignedTo: 'emp-6', // Ananya Gupta
    priority: 'High',
    status: 'In Progress',
    deadline: getRelativeDate(3),
    createdAt: getRelativeDate(-3),
    updatedAt: getRelativeDate(-1)
  },
  {
    id: 'task-107',
    title: 'Check safety stock levels for packaging boxes',
    description: 'Ensure minimum buffer stock of 500 units of corrugated boxes is maintained ahead of festival sales.',
    assignedTo: 'emp-4', // Sneha Reddy
    priority: 'Low',
    status: 'Completed',
    deadline: getRelativeDate(-5),
    createdAt: getRelativeDate(-12),
    updatedAt: getRelativeDate(-5)
  },
  {
    id: 'task-108',
    title: 'Send formal quotation to Apex Enterprises',
    description: 'Draft customized pricing proposal for 25 units of commercial display units with standard 1-year warranty.',
    assignedTo: 'emp-3', // Amit Verma
    priority: 'Critical',
    status: 'Pending',
    deadline: getRelativeDate(0), // Due Today
    createdAt: getRelativeDate(-1),
    updatedAt: getRelativeDate(-1)
  },
  {
    id: 'task-109',
    title: 'Update monthly employee attendance record',
    description: 'Reconcile attendance biometric logs with Leave Request submissions for payroll calculation.',
    assignedTo: 'emp-8', // Neha Joshi
    priority: 'Medium',
    status: 'Completed',
    deadline: getRelativeDate(-6),
    createdAt: getRelativeDate(-14),
    updatedAt: getRelativeDate(-6)
  },
  {
    id: 'task-110',
    title: 'Complete customer delivery for Order #9910',
    description: 'Ensure local dispatch van delivers fragile glass fixtures to downtown retail store by 4 PM.',
    assignedTo: 'emp-7', // Karan Malhotra
    priority: 'High',
    status: 'Completed',
    deadline: getRelativeDate(-2),
    createdAt: getRelativeDate(-5),
    updatedAt: getRelativeDate(-2)
  },
  {
    id: 'task-111',
    title: 'Inspect damaged goods shipment from Carrier B',
    description: 'Document carton damage, file formal claim ticket, and arrange replacement dispatch.',
    assignedTo: 'emp-1', // Rahul Sharma
    priority: 'Critical',
    status: 'In Progress',
    deadline: getRelativeDate(2),
    createdAt: getRelativeDate(-1),
    updatedAt: getRelativeDate(0)
  },
  {
    id: 'task-112',
    title: 'Review customer satisfaction feedback surveys',
    description: 'Analyze Q3 customer support ratings and compile action points for service improvement.',
    assignedTo: 'emp-5', // Vikram Singh
    priority: 'Low',
    status: 'Pending',
    deadline: getRelativeDate(5),
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-2)
  },
  {
    id: 'task-113',
    title: 'Renew office Wi-Fi and ISP subscription',
    description: 'Process payment for annual high-speed commercial fiber connection renewal.',
    assignedTo: 'emp-8', // Neha Joshi
    priority: 'Medium',
    status: 'Completed',
    deadline: getRelativeDate(-8),
    createdAt: getRelativeDate(-15),
    updatedAt: getRelativeDate(-8)
  },
  {
    id: 'task-114',
    title: 'Schedule maintenance check for delivery vans',
    description: 'Coordinate oil change, tire rotation, and brake checks for fleet vehicles #1 and #3.',
    assignedTo: 'emp-7', // Karan Malhotra
    priority: 'Medium',
    status: 'Pending',
    deadline: getRelativeDate(4),
    createdAt: getRelativeDate(-1),
    updatedAt: getRelativeDate(-1)
  },
  {
    id: 'task-115',
    title: 'Audit tax exemption certificates for B2B clients',
    description: 'Ensure all active client GST / Tax IDs are verified in accounting portal before billing.',
    assignedTo: 'emp-2', // Priya Patel
    priority: 'Low',
    status: 'In Progress',
    deadline: getRelativeDate(6),
    createdAt: getRelativeDate(-3),
    updatedAt: getRelativeDate(0)
  },
  {
    id: 'task-116',
    title: 'Organize warehouse shelving system (Aisle 4)',
    description: 'Relocate slow-moving stock to upper shelves to streamline picking for top-selling items.',
    assignedTo: 'emp-4', // Sneha Reddy
    priority: 'Low',
    status: 'Pending',
    deadline: getRelativeDate(7),
    createdAt: getRelativeDate(0),
    updatedAt: getRelativeDate(0)
  },
  {
    id: 'task-117',
    title: 'Draft quarterly vendor agreement contracts',
    description: 'Standardize SLA clauses for secondary logistics partners before annual contract renewals.',
    assignedTo: 'emp-6', // Ananya Gupta
    priority: 'High',
    status: 'Pending',
    deadline: getRelativeDate(4),
    createdAt: getRelativeDate(-1),
    updatedAt: getRelativeDate(-1)
  },
  {
    id: 'task-118',
    title: 'Conduct weekly staff sync and workload review',
    description: 'Review task backlog across departments and re-assign high-priority pending tickets.',
    assignedTo: 'emp-1', // Rahul Sharma
    priority: 'Medium',
    status: 'Completed',
    deadline: getRelativeDate(-1),
    createdAt: getRelativeDate(-7),
    updatedAt: getRelativeDate(-1)
  }
];
