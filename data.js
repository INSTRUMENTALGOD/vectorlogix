// ════════════════════════════════════════════════════════════
//  data.js — VectorLogix Complete State Engine v6.0 (Firebase Sync)
// ════════════════════════════════════════════════════════════

// ── Version Guard: clears stale data on schema change ────────
const DATA_VERSION = '6.0';
if (localStorage.getItem('vl_version') !== DATA_VERSION) {
  ['vl_users','vl_vehicles','vl_packages','vl_convoylog','vl_convoys','vl_session']
    .forEach(k => localStorage.removeItem(k));
  localStorage.setItem('vl_version', DATA_VERSION);
}

// ── Firebase Realtime Live Sync Engine ────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyA8M-nYyLu8MnJodXHOZ9ydWdhc9dn4nz4",
  authDomain: "vectorlogix-6ff18.firebaseapp.com",
  databaseURL: "https://vectorlogix-6ff18-default-rtdb.firebaseio.com",
  projectId: "vectorlogix-6ff18",
  storageBucket: "vectorlogix-6ff18.firebasestorage.app",
  messagingSenderId: "780088454169",
  appId: "1:780088454169:web:40b85afcd988ea0d0f4e88",
  measurementId: "G-X45TMXR4E0"
};

let isRemoteUpdating = false;

if (typeof firebase !== 'undefined') {
  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    window.db = firebase.database();

    // Listen to live database changes from ANY device connected
    window.db.ref('vl_store').on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        isRemoteUpdating = true; // Prevent echo back
        if (data.users !== undefined) localStorage.setItem('vl_users', JSON.stringify(data.users));
        if (data.vehicles !== undefined) localStorage.setItem('vl_vehicles', JSON.stringify(data.vehicles));
        if (data.packages !== undefined) localStorage.setItem('vl_packages', JSON.stringify(data.packages));
        if (data.convoys !== undefined) localStorage.setItem('vl_convoys', JSON.stringify(data.convoys));
        if (data.convoylog !== undefined) localStorage.setItem('vl_convoylog', JSON.stringify(data.convoylog));
        isRemoteUpdating = false;
        window.dispatchEvent(new Event('stateChange'));
      }
    });
  } catch (err) {
    console.warn('[Firebase Sync Init Warning]', err);
  }
}

function pushStateToFirebase() {
  if (typeof firebase !== 'undefined' && window.db && !isRemoteUpdating) {
    window.db.ref('vl_store').set({
      users: store.users,
      vehicles: store.vehicles,
      packages: store.packages,
      convoys: store.convoys,
      convoylog: store.convoyLog
    });
  }
}

// ── Constants ─────────────────────────────────────────────────
const CHECKPOINTS = [
  { id: 'CP-1', name: 'Checkpoint Alpha' },
  { id: 'CP-2', name: 'Checkpoint Bravo' }
];

const VEHICLE_TYPES    = ['Light Vehicle','Medium Truck','Heavy Truck','Tanker','Bus'];
const VEHICLE_STATUSES = ['Serviceable','Unserviceable'];
const CIVILIAN_ROLES   = ['Branch Manager','Fleet Manager','Dispatch Officer','CEO','Checkpoint Guard'];

const StatusColors = {
  'Serviceable':    '#059669',
  'Unserviceable':  '#dc2626',
  'Loading Pending':'#d97706',
  'Loading Done':   '#059669',
  'Pending':        '#64748b',
  'Allocated':      '#2563eb',
  'Dispatched':     '#059669',
  'Passed':         '#059669',
  'Not Passed':     '#dc2626',
  'Delayed':        '#d97706'
};

// ── Hardcoded Admin & Pre-seeded Custom Role Names ─────────────
const DEFAULT_ADMIN = {
  id: 'ADMIN', name: 'System Administrator',
  role: 'System Administrator', password: 'ADMIN', active: true
};

const DEFAULT_USERS = [
  { id: 'SOHA001', name: 'Soham',     role: 'Branch Manager',   password: 'SOHA001', active: true },
  { id: 'JOHN001', name: 'John',      role: 'Fleet Manager',    password: 'JOHN001', active: true },
  { id: 'GURB001', name: 'Gurbir',    role: 'Dispatch Officer', password: 'GURB001', active: true },
  { id: 'HEEM001', name: 'Heemanshu', role: 'CEO',              password: 'HEEM001', active: true }
];

// ── 10 Pre-loaded Deleteable Demo Consignments ────────────────
function generatePackages() {
  return [
    { id: 'PKG-1001', name: 'Medical Emergency Supplies Unit A', items: [{ name: 'First Aid Kits (x20)', weight: 150 }, { name: 'Bandages & IV Fluids', weight: 80 }], totalWeight: 230, vehicle: 'VEH-001', nsqm: 'SOHA001', status: 'Allocated' },
    { id: 'PKG-1002', name: 'Rations & Grain Supplies Batch B',  items: [{ name: 'Dry Rice Grain (x40 bags)', weight: 1200 }, { name: 'Canned Meat Crates', weight: 800 }], totalWeight: 2000, vehicle: 'VEH-002', nsqm: 'SOHA001', status: 'Allocated' },
    { id: 'PKG-1003', name: 'Tactical Protective Equipment',   items: [{ name: 'Kevlar Vests (x30)', weight: 300 }, { name: 'Ballistic Helmets (x30)', weight: 150 }], totalWeight: 450, vehicle: null, nsqm: 'SOHA001', status: 'Pending' },
    { id: 'PKG-1004', name: 'Heavy Vehicle Spare Tires & Oil',   items: [{ name: 'All-Terrain Tires (x4)', weight: 400 }, { name: 'Engine Synthetic Oil Drums', weight: 600 }], totalWeight: 1000, vehicle: 'VEH-003', nsqm: 'SOHA001', status: 'Allocated' },
    { id: 'PKG-1005', name: 'Emergency Diesel Fuel Drums',      items: [{ name: '200L Diesel Drums (x5)', weight: 950 }], totalWeight: 950, vehicle: 'VEH-004', nsqm: 'SOHA001', status: 'Allocated' },
    { id: 'PKG-1006', name: 'VHF Field Communication Radios',   items: [{ name: 'Portable Transceivers (x15)', weight: 60 }, { name: 'Base Station Antennas', weight: 110 }], totalWeight: 170, vehicle: null, nsqm: 'SOHA001', status: 'Pending' },
    { id: 'PKG-1007', name: 'Solar Power Generators & Arrays',  items: [{ name: 'High-Efficiency Panels', weight: 350 }, { name: 'Lithium Power Storage (x2)', weight: 450 }], totalWeight: 800, vehicle: null, nsqm: 'SOHA001', status: 'Pending' },
    { id: 'PKG-1008', name: 'Water Filtration & Purification',   items: [{ name: 'Desalination Units (x4)', weight: 500 }, { name: 'Chlorine Tablets Crates', weight: 50 }], totalWeight: 550, vehicle: 'VEH-001', nsqm: 'SOHA001', status: 'Allocated' },
    { id: 'PKG-1009', name: 'Field Shelter Tents & Folding Cots',items: [{ name: 'All-Weather Canvas Tents', weight: 600 }, { name: 'Aluminum Folding Cots', weight: 400 }], totalWeight: 1000, vehicle: null, nsqm: 'SOHA001', status: 'Pending' },
    { id: 'PKG-1010', name: 'High-Capacity Power Bank Units',   items: [{ name: 'Industrial Battery Units (x2)', weight: 1100 }], totalWeight: 1100, vehicle: null, nsqm: 'SOHA001', status: 'Pending' }
  ];
}

// ── Vehicle Generator ─────────────────────────────────────────
function generateVehicles() {
  const types = [
    { name:'Light Vehicle', capacity:2000 },
    { name:'Medium Truck',  capacity:8000 },
    { name:'Heavy Truck',   capacity:20000 },
    { name:'Tanker',        capacity:15000 },
    { name:'Bus',           capacity:3000  }
  ];
  const drivers   = ['Raj Kumar','Amit Singh','Priya Sharma','Suresh Nair','Mohan Verma',
                     'Deepak Gupta','Rahul Tiwari','Anita Patel','Vikram Joshi','Sunita Rao'];
  const coDrivers = ['Ravi Mehta','Sanjay Das','Kavita Reddy','Ashok Mishra','Pooja Pandey',
                     'Ramesh Yadav','Geeta Bose','Naresh Pillai','Shanti Devi','Kishore Kumar'];

  return Array.from({ length: 20 }, (_, i) => {
    const n  = i + 1;
    const t  = types[i % 5];
    const L1 = String.fromCharCode(65 + (n % 26));
    const L2 = String.fromCharCode(65 + ((n * 3) % 26));

    let assigned = null;
    let currentLoad = 0;
    if (n === 1) { assigned = 'SOHA001'; currentLoad = 780; }
    else if (n === 2) { assigned = 'SOHA001'; currentLoad = 2000; }
    else if (n === 3) { assigned = 'SOHA001'; currentLoad = 1000; }
    else if (n === 4) { assigned = 'SOHA001'; currentLoad = 950; }

    return {
      id:            `VEH-${String(n).padStart(3,'0')}`,
      type:          t.name,
      reg:           `DL-${1000 + (n * 37 % 9000)}-${L1}${L2}`,
      identityNo:    `VL-ID-${String(n).padStart(4,'0')}`,
      capacity:      t.capacity,
      load:          currentLoad,
      driver:        drivers[n % 10],
      driverPhone:   `98765${String(10000 + n).slice(1)}`,
      coDriver:      coDrivers[(n + 3) % 10],
      coDriverPhone: `91234${String(10000 + n).slice(1)}`,
      status:        n % 5 === 4 ? 'Unserviceable' : 'Serviceable',
      loadingStatus: currentLoad > 0 ? 'Loading Done' : 'Loading Pending',
      assignedTo:    assigned,
      destination:   assigned ? 'Forward Base Alpha' : '',
      convoyId:      null,
      pos:           { x: 8 + (n * 17) % 78, y: 8 + (n * 23) % 78 }
    };
  });
}

// ── Default Convoys ───────────────────────────────────────────
function generateConvoys() {
  return [
    {
      id: 'CNV-101',
      name: 'Convoy Alpha',
      vehicleIds: ['VEH-001', 'VEH-002'],
      createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expectedCount: 2,
      passedCount: 2,
      breakdownCount: 0,
      currentCP: 'CP-1',
      notes: 'Initial Convoy Setup'
    }
  ];
}

// ── Main Store ────────────────────────────────────────────────
const store = {

  get users() {
    const u = localStorage.getItem('vl_users');
    if (!u) { localStorage.setItem('vl_users', JSON.stringify(DEFAULT_USERS)); return DEFAULT_USERS; }
    return JSON.parse(u);
  },
  set users(v) {
    localStorage.setItem('vl_users', JSON.stringify(v));
    pushStateToFirebase();
    window.dispatchEvent(new Event('stateChange'));
  },
  get allUsers() { return [DEFAULT_ADMIN, ...this.users]; },

  get vehicles() {
    const v = localStorage.getItem('vl_vehicles');
    if (!v) { const g = generateVehicles(); localStorage.setItem('vl_vehicles', JSON.stringify(g)); return g; }
    return JSON.parse(v);
  },
  set vehicles(v) {
    localStorage.setItem('vl_vehicles', JSON.stringify(v));
    pushStateToFirebase();
    window.dispatchEvent(new Event('stateChange'));
  },

  get packages() {
    const p = localStorage.getItem('vl_packages');
    if (!p) { const g = generatePackages(); localStorage.setItem('vl_packages', JSON.stringify(g)); return g; }
    return JSON.parse(p);
  },
  set packages(v) {
    localStorage.setItem('vl_packages', JSON.stringify(v));
    pushStateToFirebase();
    window.dispatchEvent(new Event('stateChange'));
  },

  get convoys() {
    const c = localStorage.getItem('vl_convoys');
    if (!c) { const g = generateConvoys(); localStorage.setItem('vl_convoys', JSON.stringify(g)); return g; }
    return JSON.parse(c);
  },
  set convoys(v) {
    localStorage.setItem('vl_convoys', JSON.stringify(v));
    pushStateToFirebase();
    window.dispatchEvent(new Event('stateChange'));
  },

  get convoyLog() {
    const c = localStorage.getItem('vl_convoylog');
    return c ? JSON.parse(c) : [];
  },
  set convoyLog(v) {
    localStorage.setItem('vl_convoylog', JSON.stringify(v));
    pushStateToFirebase();
    window.dispatchEvent(new Event('stateChange'));
  },

  get session() {
    const s = localStorage.getItem('vl_session');
    return s ? JSON.parse(s) : null;
  },
  set session(v) {
    v ? localStorage.setItem('vl_session', JSON.stringify(v))
      : localStorage.removeItem('vl_session');
    window.dispatchEvent(new Event('stateChange'));
  },

  get currentUser() { return this.session; },
  get role()        { return this.session?.role ?? null; },
  get userId()      { return this.session?.id   ?? null; },

  _page: 'dashboard',
  get activePage()  { return this._page; },
  set activePage(v) { this._page = v; window.dispatchEvent(new Event('stateChange')); },

  login(id, pwd) {
    const user = this.allUsers.find(u =>
      u.id.toUpperCase() === id.trim().toUpperCase() &&
      u.password === pwd.trim() &&
      u.active !== false
    );
    if (user) { this.session = user; return { success: true }; }
    return { success: false, msg: 'Invalid User ID or Password.' };
  },

  logout() {
    this.session = null;
    this._page = 'dashboard';
    window.dispatchEvent(new Event('stateChange'));
  },

  generateUserId(name, role) {
    const prefix = name.trim().toUpperCase().replace(/\s+/g,'').substring(0, 4);
    const count  = this.users.filter(u => u.role === role).length + 1;
    return `${prefix}${String(count).padStart(3,'0')}`;
  },

  addUser(name, role, checkpoint = null) {
    const id      = this.generateUserId(name, role);
    const newUser = { id, name, role, password: id, active: true, checkpoint };
    const list    = this.users;
    list.push(newUser);
    this.users = list;
    return newUser;
  },

  deleteUser(uid) {
    this.users    = this.users.filter(u => u.id !== uid);
    this.vehicles = this.vehicles.map(v => v.assignedTo === uid ? { ...v, assignedTo: null } : v);
    pushStateToFirebase();
  },

  deleteVehicle(vid) {
    this.vehicles = this.vehicles.filter(v => v.id !== vid);
    this.packages = this.packages.map(p => p.vehicle === vid ? { ...p, vehicle: null, status: 'Pending' } : p);
    pushStateToFirebase();
  },

  deletePackage(pid) {
    const targetPkg = this.packages.find(p => p.id === pid);
    if (targetPkg && targetPkg.vehicle) {
      const vid = targetPkg.vehicle;
      this.vehicles = this.vehicles.map(v => v.id === vid ? { ...v, load: Math.max(0, v.load - targetPkg.totalWeight) } : v);
    }
    this.packages = this.packages.filter(p => p.id !== pid);
    pushStateToFirebase();
  },

  unassignVehicle(vid) {
    this.vehicles = this.vehicles.map(v => v.id === vid ? { ...v, assignedTo: null } : v);
    pushStateToFirebase();
  },

  createConvoy(name, vehicleIds) {
    const id = `CNV-${Date.now().toString().slice(-4)}`;
    const newConvoy = {
      id,
      name,
      vehicleIds,
      createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expectedCount: vehicleIds.length,
      passedCount: vehicleIds.length,
      breakdownCount: 0,
      currentCP: 'CP-1',
      notes: 'Convoy Created'
    };

    const cList = this.convoys;
    cList.push(newConvoy);
    this.convoys = cList;

    // Update vehicles with convoyId
    this.vehicles = this.vehicles.map(v => vehicleIds.includes(v.id) ? { ...v, convoyId: id } : v);
    return newConvoy;
  },

  deleteConvoy(convoyId) {
    this.convoys = this.convoys.filter(c => c.id !== convoyId);
    this.vehicles = this.vehicles.map(v => v.convoyId === convoyId ? { ...v, convoyId: null } : v);
    pushStateToFirebase();
  },

  updateConvoyCheckpoint(convoyId, cpId, status, passedVehiclesCount, breakdownCount, noteText = '') {
    const cList = this.convoys.map(c => {
      if (c.id === convoyId) {
        const remainingForNextCP = passedVehiclesCount; // Number passed becomes expected for next CP
        const nextCP = cpId === 'CP-1' ? 'CP-2' : 'Destination Base';
        return {
          ...c,
          passedCount: passedVehiclesCount,
          breakdownCount: breakdownCount,
          expectedCount: remainingForNextCP,
          currentCP: nextCP,
          notes: noteText
        };
      }
      return c;
    });
    this.convoys = cList;

    // Push log entry
    const logEntry = {
      timestamp: new Date().toLocaleTimeString(),
      cpId,
      convoyId,
      status,
      passedCount: passedVehiclesCount,
      breakdownCount,
      note: noteText ? `(${noteText})` : ''
    };
    const logs = this.convoyLog;
    logs.unshift(logEntry);
    this.convoyLog = logs;
  }
};

// Init state on first load
if (!localStorage.getItem('vl_users'))    store.users    = DEFAULT_USERS;
if (!localStorage.getItem('vl_vehicles')) store.vehicles = generateVehicles();
if (!localStorage.getItem('vl_packages')) store.packages = generatePackages();
if (!localStorage.getItem('vl_convoys'))  store.convoys  = generateConvoys();
