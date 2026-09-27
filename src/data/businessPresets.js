// Business Type Presets & Department Templates for BizFlow

export const BUSINESS_TYPES = [
  {
    id: 'sweet_shop',
    name: 'Sweet Shop / Bakery / Food Retail',
    icon: 'Store',
    description: 'Fresh sweets, savory snacks, bakery items, counter sales & kitchen inventory.',
    departments: [
      'Kitchen & Production',
      'Counter & Retail Sales',
      'Inventory & Raw Materials',
      'Packaging & Dispatch',
      'Billing & Cashier',
      'Hygiene & Maintenance'
    ],
    sampleTasks: [
      {
        title: 'Check raw sugar, mawa & ghee stock in store',
        description: 'Verify minimum buffer of 100kg sugar and 50L pure ghee for weekend festival rush.',
        priority: 'Critical',
        status: 'Pending',
        deadlineOffset: -1,
        dept: 'Inventory & Raw Materials'
      },
      {
        title: 'Inspect morning Kaju Katli & Gulab Jamun batch',
        description: 'Quality check taste, texture, and hygiene before shifting batch to front display counter.',
        priority: 'High',
        status: 'In Progress',
        deadlineOffset: 0,
        dept: 'Kitchen & Production'
      },
      {
        title: 'Clean and sanitize front glass display counters',
        description: 'Wipe all glass display cases, restock price cards, and clean serving trays.',
        priority: 'Medium',
        status: 'Completed',
        deadlineOffset: -2,
        dept: 'Hygiene & Maintenance'
      },
      {
        title: 'Prepare 50 gift box packaging for corporate order',
        description: 'Assemble decorative 1kg dry fruit sweet boxes for Apex Traders dispatch by 4 PM.',
        priority: 'High',
        status: 'Pending',
        deadlineOffset: 1,
        dept: 'Packaging & Dispatch'
      },
      {
        title: 'Reconcile daily counter cash register & UPI receipts',
        description: 'Match billing POS receipts with cash box and online QR payments at end of shift.',
        priority: 'Medium',
        status: 'Pending',
        deadlineOffset: 2,
        dept: 'Billing & Cashier'
      }
    ],
    sampleEmployees: [
      { name: 'Chef Suresh Kumar', role: 'Head Halwai / Chef', department: 'Kitchen & Production' },
      { name: 'Meena Sharma', role: 'Counter Sales Executive', department: 'Counter & Retail Sales' },
      { name: 'Rajesh Gupta', role: 'Store & Inventory Helper', department: 'Inventory & Raw Materials' },
      { name: 'Anita Patel', role: 'Billing Operator', department: 'Billing & Cashier' }
    ]
  },
  {
    id: 'motel',
    name: 'Motel / Hotel / Guest House',
    icon: 'Hotel',
    description: 'Room check-in, housekeeping, laundry, maintenance, and guest services.',
    departments: [
      'Front Desk & Reception',
      'Housekeeping',
      'Maintenance & Repairs',
      'Kitchen & Room Service',
      'Laundry & Linen',
      'Billing & Night Audit'
    ],
    sampleTasks: [
      {
        title: 'Inspect Room 204 after guest checkout',
        description: 'Conduct deep cleaning, change bedsheets, replace toiletries, and inspect AC function.',
        priority: 'Critical',
        status: 'Pending',
        deadlineOffset: -1,
        dept: 'Housekeeping'
      },
      {
        title: 'Fix leaking bathroom faucet in Room 108',
        description: 'Guest reported minor plumbing leak under sink. Replace rubber washer.',
        priority: 'High',
        status: 'In Progress',
        deadlineOffset: 0,
        dept: 'Maintenance & Repairs'
      },
      {
        title: 'Restock clean linen & bath towels from laundry',
        description: 'Fold and stack 80 fresh towel sets in 2nd floor housekeeping storage cabinet.',
        priority: 'Medium',
        status: 'Completed',
        deadlineOffset: -3,
        dept: 'Laundry & Linen'
      },
      {
        title: 'Prepare complimentary breakfast tray for Room 302',
        description: 'Deliver tea, eggs, and toast breakfast tray by 8:30 AM as per guest request.',
        priority: 'High',
        status: 'Pending',
        deadlineOffset: 1,
        dept: 'Kitchen & Room Service'
      },
      {
        title: 'Complete daily night audit reconciliation report',
        description: 'Verify guest ledger balances, credit card terminals, and room occupancy count.',
        priority: 'Medium',
        status: 'Pending',
        deadlineOffset: 2,
        dept: 'Billing & Night Audit'
      }
    ],
    sampleEmployees: [
      { name: 'Vikram Malhotra', role: 'Front Desk Manager', department: 'Front Desk & Reception' },
      { name: 'Sunita Devi', role: 'Housekeeping Lead', department: 'Housekeeping' },
      { name: 'Ramesh Plumber', role: 'Maintenance Supervisor', department: 'Maintenance & Repairs' },
      { name: 'Karan Singh', role: 'Room Service Attendant', department: 'Kitchen & Room Service' }
    ]
  },
  {
    id: 'retail',
    name: 'Retail Store / Supermarket / Boutique',
    icon: 'ShoppingBag',
    description: 'Shelf stock, cashier billing, vendor orders, customer service & sales.',
    departments: [
      'Store Floor & Sales',
      'Inventory & Stockroom',
      'Billing & Cashier',
      'Procurement & Suppliers',
      'Customer Service',
      'Facility & Security'
    ],
    sampleTasks: [
      {
        title: 'Restock Aisle 3 beverage display shelves',
        description: 'Move 15 cases of cold drinks from backroom storage to front refrigerated racks.',
        priority: 'High',
        status: 'In Progress',
        deadlineOffset: 0,
        dept: 'Store Floor & Sales'
      },
      {
        title: 'Verify barcode price tags on new apparel arrival',
        description: 'Attach promotional discount labels to Q3 autumn jackets inventory.',
        priority: 'Medium',
        status: 'Pending',
        deadlineOffset: 1,
        dept: 'Inventory & Stockroom'
      },
      {
        title: 'Process bulk vendor payment for Supplier #99',
        description: 'Reconcile invoice with warehouse receipt note before issuing bank transfer.',
        priority: 'Critical',
        status: 'Pending',
        deadlineOffset: -2,
        dept: 'Procurement & Suppliers'
      }
    ],
    sampleEmployees: [
      { name: 'Amit Verma', role: 'Store Floor Supervisor', department: 'Store Floor & Sales' },
      { name: 'Priya Nair', role: 'Head Cashier', department: 'Billing & Cashier' },
      { name: 'Rahul Joshi', role: 'Inventory Manager', department: 'Inventory & Stockroom' }
    ]
  },
  {
    id: 'auto_repair',
    name: 'Auto Garage / Car Workshop',
    icon: 'Wrench',
    description: 'Vehicle servicing, spare parts stock, estimates, towing & repairs.',
    departments: [
      'Mechanic Workbay',
      'Spare Parts & Inventory',
      'Customer Advisor & Service',
      'Billing & Estimates',
      'Towing & Fleet Logistics'
    ],
    sampleTasks: [
      {
        title: 'Complete engine oil & brake check for Car #KA-05-9921',
        description: 'Perform 10,000 km routine service, replace air filter, and rotate tires.',
        priority: 'High',
        status: 'In Progress',
        deadlineOffset: 0,
        dept: 'Mechanic Workbay'
      },
      {
        title: 'Order replacement brake pads for SUV Model B',
        description: 'Inquire with local automotive supplier for same-day delivery of front brake pads.',
        priority: 'Critical',
        status: 'Pending',
        deadlineOffset: -1,
        dept: 'Spare Parts & Inventory'
      }
    ],
    sampleEmployees: [
      { name: 'Master Mechanic Salim', role: 'Senior Automobile Technician', department: 'Mechanic Workbay' },
      { name: 'Neha Reddy', role: 'Service Advisor', department: 'Customer Advisor & Service' }
    ]
  },
  {
    id: 'clinic',
    name: 'Clinic / Pharmacy / Healthcare',
    icon: 'Activity',
    description: 'Patient appointments, medicine stock, lab reports, billing & sanitization.',
    departments: [
      'Patient Reception & Records',
      'Pharmacy & Medicine Stock',
      'Lab & Diagnostics',
      'Billing & Insurance',
      'Sanitization & Facility'
    ],
    sampleTasks: [
      {
        title: 'Audit essential antibiotic medicine expiry dates',
        description: 'Remove batch #8812 medicines expiring this month from active pharmacy shelves.',
        priority: 'Critical',
        status: 'Pending',
        deadlineOffset: -1,
        dept: 'Pharmacy & Medicine Stock'
      },
      {
        title: 'Sanitize examination rooms 1 and 2',
        description: 'Complete UV light and chemical spray sanitization cycle after morning OPD hours.',
        priority: 'High',
        status: 'Completed',
        deadlineOffset: -2,
        dept: 'Sanitization & Facility'
      }
    ],
    sampleEmployees: [
      { name: 'Dr. Ananya Roy', role: 'Chief Medical Officer', department: 'Patient Reception & Records' },
      { name: 'Karan Pharmacist', role: 'Licensed Pharmacist', department: 'Pharmacy & Medicine Stock' }
    ]
  },
  {
    id: 'general',
    name: 'General Business / Office Services',
    icon: 'Briefcase',
    description: 'Operations, client projects, invoicing, sales & administrative tasks.',
    departments: [
      'Operations',
      'Sales & Marketing',
      'Finance & Accounts',
      'Logistics & Shipping',
      'Customer Support',
      'Human Resources'
    ],
    sampleTasks: [
      {
        title: 'Prepare Q3 financial overview for management',
        description: 'Summarize monthly income statement and balance sheet for board presentation.',
        priority: 'High',
        status: 'In Progress',
        deadlineOffset: 1,
        dept: 'Finance & Accounts'
      },
      {
        title: 'Follow up with prospective corporate client',
        description: 'Send revised commercial quotation and schedule demo call for Tuesday.',
        priority: 'Medium',
        status: 'Pending',
        deadlineOffset: 2,
        dept: 'Sales & Marketing'
      }
    ],
    sampleEmployees: [
      { name: 'Rahul Sharma', role: 'Operations Director', department: 'Operations' },
      { name: 'Priya Patel', role: 'Finance Manager', department: 'Finance & Accounts' }
    ]
  }
];

export const getPresetById = (id) => {
  return BUSINESS_TYPES.find(b => b.id === id) || BUSINESS_TYPES[5]; // fallback to general
};
