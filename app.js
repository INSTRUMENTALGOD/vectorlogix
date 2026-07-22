// ════════════════════════════════════════════════════════════
//  app.js — VectorLogix Core Application Logic v6.0
// ════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  window.addEventListener('stateChange', renderApp);
});

function renderApp() {
  const root = document.getElementById('root');
  if (!root) return;
  root.innerHTML = '';

  const user = store.currentUser;

  if (!user) {
    root.appendChild(renderLoginScreen());
    return;
  }

  const appContainer = createElement('div', { className: 'app-container' });

  switch (user.role) {
    case 'System Administrator':
      appContainer.appendChild(renderAdminDashboard());
      break;
    case 'Branch Manager':
      appContainer.appendChild(renderBranchManagerDashboard());
      break;
    case 'Fleet Manager':
      appContainer.appendChild(renderFleetManagerDashboard());
      break;
    case 'Dispatch Officer':
      appContainer.appendChild(renderDispatchOfficerDashboard());
      break;
    case 'CEO':
      appContainer.appendChild(renderCEODashboard());
      break;
    case 'Checkpoint Guard':
      appContainer.appendChild(renderCheckpointGuardDashboard());
      break;
    default:
      store.logout();
      return;
  }

  root.appendChild(appContainer);
}

// ──────────────────────────────────────────────────────────────
//  LOGIN SCREEN
// ──────────────────────────────────────────────────────────────
function renderLoginScreen() {
  const userIdInput = createElement('input', {
    className: 'input-field',
    attributes: { type: 'text', placeholder: 'Enter User ID (e.g., SOHA001)' }
  });
  const pwdInput = createElement('input', {
    className: 'input-field',
    attributes: { type: 'password', placeholder: 'Enter Password' }
  });
  const errorMsg = createElement('div', {
    styles: { color: 'var(--danger)', fontSize: '13px', marginTop: '8px', display: 'none' }
  });

  const handleLogin = () => {
    const uid = userIdInput.value.trim();
    const pwd = pwdInput.value.trim();
    if (!uid || !pwd) {
      errorMsg.textContent = 'Please enter both User ID and Password.';
      errorMsg.style.display = 'block';
      return;
    }
    const res = store.login(uid, pwd);
    if (!res.success) {
      errorMsg.textContent = res.msg;
      errorMsg.style.display = 'block';
    }
  };

  const loginBox = Card([
    createElement('div', { className: 'flex-center flex-column mb-4', children: [
      createElement('div', {
        className: 'brand-logo mb-2',
        innerHTML: `${Icons.Truck}<span style="margin-left:8px;font-weight:bold;letter-spacing:1px;font-size:22px;color:var(--primary);">VectorLogix</span>`
      }),
      createElement('p', { textContent: 'Logistics Command & Control System', styles: { color: 'var(--text-muted)', fontSize: '12px' } })
    ]}),

    Field('User ID', userIdInput),
    Field('Password', pwdInput),
    errorMsg,

    createElement('button', {
      className: 'btn btn-primary w-100 mt-4',
      textContent: 'Sign In to System',
      onClick: handleLogin
    })
  ], { className: 'login-card animate-fade-in' });

  pwdInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleLogin(); });

  return createElement('div', {
    className: 'flex-center min-vh-100',
    styles: { background: '#f8fafc', padding: '20px' },
    children: [loginBox]
  });
}

function renderHeader(title, subtitle) {
  return TopBar(title, subtitle);
}

// ──────────────────────────────────────────────────────────────
//  ROLE 1: SYSTEM ADMINISTRATOR
// ──────────────────────────────────────────────────────────────
function renderAdminDashboard() {
  const container = createElement('div', { className: 'p-4 max-w-1000' });
  container.appendChild(renderHeader('System Administration', 'User Allocation & Role Assignment'));

  const users = store.users;
  const userRows = users.map(u => createElement('div', {
    className: 'user-row flex-between p-3 mb-2',
    styles: { background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' },
    children: [
      createElement('div', {
        children: [
          createElement('div', { textContent: u.name, styles: { fontWeight: '600' } }),
          createElement('div', { textContent: `User ID: ${u.id} | Password: ${u.password}`, styles: { fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' } }),
          u.checkpoint ? createElement('div', { textContent: `Assigned: ${u.checkpoint}`, styles: { fontSize: '10px', color: 'var(--primary)' } }) : null
        ]
      }),
      createElement('div', { className: 'flex-center', styles: { gap: '8px' }, children: [
        Pill(u.role, 'var(--primary)'),
        createElement('button', {
          className: 'btn btn-danger-text p-1',
          innerHTML: Icons.Trash,
          onClick: () => {
            if (confirm(`Remove user ${u.name} (${u.id})?`)) store.deleteUser(u.id);
          }
        })
      ]})
    ]
  }));

  const formWrap = createElement('div', { styles: { display: 'none' } });
  const nameInput = createElement('input', { className: 'input-field', attributes: { placeholder: 'Full Name' } });
  const roleSelect = createElement('select', { className: 'input-field' });
  CIVILIAN_ROLES.forEach(r => {
    const opt = document.createElement('option'); opt.value = r; opt.textContent = r; roleSelect.appendChild(opt);
  });

  const cpSelectWrap = createElement('div', { styles: { display: 'none' } });
  const cpSelect = createElement('select', { className: 'input-field' });
  CHECKPOINTS.forEach(cp => {
    const opt = document.createElement('option'); opt.value = cp.id; opt.textContent = `${cp.id} — ${cp.name}`; cpSelect.appendChild(opt);
  });
  cpSelectWrap.appendChild(Field('Assign Checkpoint', cpSelect));

  roleSelect.addEventListener('change', () => {
    cpSelectWrap.style.display = roleSelect.value === 'Checkpoint Guard' ? 'block' : 'none';
  });

  const handleCreate = () => {
    const name = nameInput.value.trim();
    const role = roleSelect.value;
    const cp = role === 'Checkpoint Guard' ? cpSelect.value : null;

    if (!name) { alert('Please enter user name.'); return; }

    if (['Fleet Manager', 'Dispatch Officer', 'CEO'].includes(role)) {
      const existing = store.users.find(u => u.role === role);
      if (existing) { alert(`A ${role} already exists (${existing.id}). Only 1 allowed.`); return; }
    }

    const newUser = store.addUser(name, role, cp);
    alert(`User Created Successfully!\n\nName: ${newUser.name}\nUser ID: ${newUser.id}\nPassword: ${newUser.password}\nRole: ${newUser.role}`);
    nameInput.value = '';
    formWrap.style.display = 'none';
  };

  formWrap.appendChild(Card([
    createElement('h4', { textContent: 'Create & Allocate New Role', className: 'mb-3' }),
    Field('Full Name', nameInput),
    Field('Assign Role', roleSelect),
    cpSelectWrap,
    createElement('div', { className: 'flex-between mt-3', children: [
      createElement('button', { className: 'btn btn-secondary', textContent: 'Cancel', onClick: () => { formWrap.style.display = 'none'; } }),
      createElement('button', { className: 'btn btn-primary', textContent: 'Generate ID & Allocate', onClick: handleCreate })
    ]})
  ]));

  container.appendChild(Card([
    createElement('div', { className: 'flex-between mb-3', children: [
      createElement('div', { children: [
        createElement('h4', { textContent: 'System Users' }),
        createElement('p', { textContent: `${users.length} active system accounts`, styles: { fontSize: '12px', color: 'var(--text-muted)' } })
      ]}),
      createElement('button', {
        className: 'btn btn-primary',
        innerHTML: `${Icons.PersonPlus} <span style="margin-left:6px;">Add New User</span>`,
        onClick: () => { formWrap.style.display = formWrap.style.display === 'none' ? 'block' : 'none'; }
      })
    ]}),
    formWrap,
    createElement('div', { children: userRows })
  ]));

  return container;
}

// ──────────────────────────────────────────────────────────────
//  ROLE 2: BRANCH MANAGER (NSQM — Soham)
// ──────────────────────────────────────────────────────────────
function renderBranchManagerDashboard() {
  const container = createElement('div', { className: 'p-4 max-w-1000' });
  const activeTab = store.activePage || 'dashboard';

  container.appendChild(renderHeader(`Branch Manager (${store.currentUser?.name})`, `Logistics Hub • User ID: ${store.userId}`));

  // Updated Sub-Nav Tabs: Merged "Allocate to Vehicle" & "Loading Update" into one single "Allocate to Vehicle" tab
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Home },
    { id: 'packages',  label: 'Create Package', icon: Icons.Package },
    { id: 'allocate',  label: 'Allocate to Vehicle', icon: Icons.Clipboard },
    { id: 'tracking',  label: 'Track Vehicles', icon: Icons.MapPin }
  ];

  const subNav = createElement('div', {
    className: 'sub-nav mb-4 flex-center',
    styles: { gap: '8px', overflowX: 'auto', paddingBottom: '4px' },
    children: navTabs.map(t => createElement('button', {
      className: `btn ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'} btn-sm`,
      innerHTML: `${t.icon} <span style="margin-left:4px;">${t.label}</span>`,
      onClick: () => { store.activePage = t.id; }
    }))
  });
  container.appendChild(subNav);

  const myPackages = store.packages.filter(p => p.nsqm === store.userId || !p.nsqm);
  const myVehicles = store.vehicles.filter(v => v.assignedTo === store.userId);

  if (activeTab === 'dashboard') {
    const pStats = {
      Pending:    myPackages.filter(p => p.status === 'Pending').length,
      Allocated:  myPackages.filter(p => p.status === 'Allocated').length,
      Dispatched: myPackages.filter(p => p.status === 'Dispatched').length
    };

    const pieData = [
      { label: 'Pending',    value: pStats.Pending,    color: StatusColors.Pending },
      { label: 'Allocated',  value: pStats.Allocated,  color: StatusColors.Allocated },
      { label: 'Dispatched', value: pStats.Dispatched, color: StatusColors.Dispatched }
    ];

    container.appendChild(Card([
      createElement('h4', { textContent: 'Package Status Overview', className: 'mb-2' }),
      createElement('p', { textContent: 'Live status breakdown of packages managed by your branch', styles: { fontSize: '12px', color: 'var(--text-muted)' } }),
      generatePieChart(pieData, 180),
      Divider(),
      createElement('div', {
        className: 'grid-3 mt-3',
        children: [
          StatBox('Total Packages', myPackages.length, 'var(--primary)'),
          StatBox('Assigned Vehicles', myVehicles.length, '#059669'),
          StatBox('Pending Load', pStats.Pending, '#d97706')
        ]
      })
    ]));

    // Package List Card (Deleteable)
    const pkgRows = myPackages.map(p => createElement('div', {
      className: 'flex-between p-3 mb-2',
      styles: { background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' },
      children: [
        createElement('div', { children: [
          createElement('strong', { textContent: p.name, styles: { fontSize: '14px' } }),
          createElement('div', { textContent: `ID: ${p.id} | Weight: ${p.totalWeight} kg | Vehicle: ${p.vehicle || 'Unallocated'}`, styles: { fontSize: '11px', color: 'var(--text-muted)' } })
        ]}),
        createElement('div', { className: 'flex-center', styles: { gap: '6px' }, children: [
          Pill(p.status, StatusColors[p.status]),
          createElement('button', {
            className: 'btn btn-danger-text p-1',
            innerHTML: Icons.Trash,
            attributes: { title: 'Delete Package' },
            onClick: () => {
              if (confirm(`Are you sure you want to delete package ${p.name} (${p.id})?`)) store.deletePackage(p.id);
            }
          })
        ]})
      ]
    }));

    container.appendChild(Card([
      createElement('h4', { textContent: `Consignment Packages (${myPackages.length})`, className: 'mb-3' }),
      myPackages.length === 0
        ? createElement('p', { textContent: 'No packages found.', styles: { color: 'var(--text-muted)' } })
        : createElement('div', { children: pkgRows })
    ]));

  } else if (activeTab === 'packages') {
    const pkgNameInput = createElement('input', { className: 'input-field', attributes: { placeholder: 'Enter consignment package name...' } });
    const itemsList = [{ name: '', weight: 0 }];

    const itemsContainer = createElement('div', { className: 'mt-2' });
    const liveWeightEl = createElement('div', {
      styles: { fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)', margin: '10px 0' },
      textContent: 'Total Package Weight: 0 kg'
    });

    const updateLiveWeight = () => {
      let tot = 0;
      itemsContainer.querySelectorAll('.item-row').forEach(row => {
        const w = parseFloat(row.querySelector('.item-weight').value) || 0;
        tot += w;
      });
      liveWeightEl.textContent = `Total Package Weight: ${tot.toLocaleString()} kg`;
    };

    const renderItemRows = () => {
      itemsContainer.innerHTML = '';
      itemsList.forEach((it, idx) => {
        const nameIn = createElement('input', {
          className: 'input-field item-name',
          attributes: { placeholder: `Item ${idx + 1} Name`, value: it.name },
          onInput: (e) => { itemsList[idx].name = e.target.value; }
        });
        const weightIn = createElement('input', {
          className: 'input-field item-weight',
          attributes: { type: 'number', placeholder: 'Weight (kg)', value: it.weight || '' },
          onInput: (e) => {
            itemsList[idx].weight = parseFloat(e.target.value) || 0;
            updateLiveWeight();
          }
        });
        const delBtn = createElement('button', {
          className: 'btn btn-danger-text p-1',
          innerHTML: Icons.Trash,
          onClick: () => {
            if (itemsList.length > 1) {
              itemsList.splice(idx, 1);
              renderItemRows();
              updateLiveWeight();
            }
          }
        });

        itemsContainer.appendChild(createElement('div', {
          className: 'item-row flex-center mb-2',
          styles: { gap: '8px' },
          children: [nameIn, weightIn, delBtn]
        }));
      });
    };

    renderItemRows();

    const addObjBtn = createElement('button', {
      className: 'btn btn-secondary btn-sm mb-3',
      innerHTML: `${Icons.Plus} Add Item`,
      onClick: () => {
        itemsList.push({ name: '', weight: 0 });
        renderItemRows();
      }
    });

    const handleSavePkg = () => {
      const name = pkgNameInput.value.trim();
      if (!name) { alert('Please enter Package Name.'); return; }
      const validItems = itemsList.filter(i => i.name.trim() !== '');
      if (validItems.length === 0) { alert('Please add at least 1 item with a name.'); return; }

      const totalW = validItems.reduce((s, i) => s + (parseFloat(i.weight) || 0), 0);

      const newPkg = {
        id: `PKG-${Date.now().toString().slice(-5)}`,
        name,
        items: validItems,
        totalWeight: totalW,
        vehicle: null,
        nsqm: store.userId,
        status: 'Pending'
      };

      const list = store.packages;
      list.push(newPkg);
      store.packages = list;

      alert(`Package created successfully!\nPackage ID: ${newPkg.id}\nTotal Weight: ${totalW} kg`);
      pkgNameInput.value = '';
      itemsList.length = 0;
      itemsList.push({ name: '', weight: 0 });
      renderItemRows();
      updateLiveWeight();
    };

    container.appendChild(Card([
      createElement('h4', { textContent: 'Create Consignment Package', className: 'mb-2' }),
      Field('Package Name / Description', pkgNameInput),
      createElement('label', { className: 'label', textContent: 'Items Breakdown (Name & Weight per item)' }),
      itemsContainer,
      addObjBtn,
      liveWeightEl,
      createElement('button', { className: 'btn btn-primary w-100 mt-2', textContent: 'Save Consignment Package', onClick: handleSavePkg })
    ]));

  } else if (activeTab === 'allocate') {
    // MERGED TAB: "Allocate to Vehicle" (Vehicle Checkboxes + Details + Driver/Co-Driver Numbers + Package Checkboxes + Warning Sound + PDF Manifest Export)
    let selectedVehId = myVehicles.length > 0 ? myVehicles[0].id : null;
    const selectedPkgIds = new Set();

    const mainWrap = createElement('div');

    const renderAllocateScreen = () => {
      mainWrap.innerHTML = '';

      if (myVehicles.length === 0) {
        mainWrap.appendChild(Card([
          createElement('p', { textContent: 'No vehicles assigned to your branch. Contact Dispatch Officer.', styles: { color: 'var(--danger)' } })
        ]));
        return;
      }

      const activeVeh = store.vehicles.find(v => v.id === selectedVehId) || myVehicles[0];

      // Vehicle Checkboxes List
      const vehCheckboxList = createElement('div', { className: 'mb-4' });
      vehCheckboxList.appendChild(createElement('label', { className: 'label', textContent: '1. Select Vehicle (Tick checkbox to view details & allocate)' }));

      myVehicles.forEach(v => {
        const isChecked = v.id === activeVeh.id;
        const item = createElement('label', {
          className: 'check-item',
          children: [
            createElement('input', {
              attributes: { type: 'checkbox', ...(isChecked ? { checked: 'checked' } : {}) },
              onChange: (e) => {
                if (e.target.checked) selectedVehId = v.id;
                renderAllocateScreen();
              }
            }),
            createElement('div', {
              children: [
                createElement('strong', { textContent: `${v.id} (${v.type})` }),
                createElement('div', { textContent: `Reg: ${v.reg} | Cap: ${v.capacity}kg | Current Load: ${v.load}kg`, styles: { fontSize: '11px', color: 'var(--text-muted)' } })
              ]
            })
          ]
        });
        vehCheckboxList.appendChild(item);
      });

      // Active Vehicle Details & Driver/Co-Driver Phone Inputs
      const driverPhoneInput = createElement('input', { className: 'input-field', attributes: { placeholder: 'Driver Mobile Number', value: activeVeh.driverPhone || '' } });
      const coDriverNameInput = createElement('input', { className: 'input-field', attributes: { placeholder: 'Co-Driver Name', value: activeVeh.coDriver || '' } });
      const coDriverPhoneInput = createElement('input', { className: 'input-field', attributes: { placeholder: 'Co-Driver Mobile Number', value: activeVeh.coDriverPhone || '' } });
      const destInput = createElement('input', { className: 'input-field', attributes: { placeholder: 'Destination Hub', value: activeVeh.destination || '' } });

      const saveDriverDetailsBtn = createElement('button', {
        className: 'btn btn-secondary btn-sm mt-2 mb-3',
        textContent: 'Save Driver/Co-Driver Details',
        onClick: () => {
          store.vehicles = store.vehicles.map(v => v.id === activeVeh.id ? {
            ...v,
            driverPhone: driverPhoneInput.value.trim(),
            coDriver: coDriverNameInput.value.trim(),
            coDriverPhone: coDriverPhoneInput.value.trim(),
            destination: destInput.value.trim()
          } : v);
          alert(`Details updated for vehicle ${activeVeh.id}!`);
        }
      });

      // Loaded Packages on Active Vehicle
      const loadedPkgs = store.packages.filter(p => p.vehicle === activeVeh.id);

      // Stores Carrying Button
      const storesBtn = createElement('button', {
        className: 'btn btn-secondary btn-sm',
        innerHTML: `${Icons.Package} <span style="margin-left:4px;">Stores Carrying (${loadedPkgs.length})</span>`,
        onClick: () => showStoresModal(activeVeh, loadedPkgs)
      });

      // PDF Manifest Export Button
      const pdfBtn = createElement('button', {
        className: 'btn btn-primary btn-sm',
        innerHTML: `${Icons.Clipboard} <span style="margin-left:4px;">Generate Load Manifest PDF</span>`,
        onClick: () => generateLoadManifestPDF(activeVeh, loadedPkgs)
      });

      // Mark Loading Done Toggle
      const loadingToggleBtn = createElement('button', {
        className: `btn ${activeVeh.loadingStatus === 'Loading Done' ? 'btn-success' : 'btn-secondary'} btn-sm`,
        textContent: activeVeh.loadingStatus === 'Loading Done' ? '✓ Loading Done' : 'Mark Loading Done',
        onClick: () => {
          const next = activeVeh.loadingStatus === 'Loading Done' ? 'Loading Pending' : 'Loading Done';
          store.vehicles = store.vehicles.map(v => v.id === activeVeh.id ? { ...v, loadingStatus: next } : v);
          renderAllocateScreen();
        }
      });

      // Section 2: Package Checkboxes Selection with Weight Calculation & Sound Warning
      const availPkgs = store.packages.filter(p => p.nsqm === store.userId && (!p.vehicle || p.vehicle === activeVeh.id));

      const proposedWeightDisplay = createElement('div', {
        styles: { fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)', margin: '12px 0' },
        textContent: `Selected Load: 0 kg / Max Capacity: ${activeVeh.capacity} kg`
      });

      const pkgCheckboxList = createElement('div', { className: 'mt-2 mb-3' });
      pkgCheckboxList.appendChild(createElement('label', { className: 'label', textContent: '2. Select Cargo Packages to Load (Tick checkboxes)' }));

      const calculateProposedLoad = () => {
        let proposed = 0;
        pkgCheckboxList.querySelectorAll('.pkg-check input').forEach(input => {
          if (input.checked) {
            proposed += parseFloat(input.getAttribute('data-weight')) || 0;
          }
        });

        proposedWeightDisplay.textContent = `Selected Load: ${proposed.toLocaleString()} kg / Capacity: ${activeVeh.capacity.toLocaleString()} kg`;

        if (proposed > activeVeh.capacity) {
          proposedWeightDisplay.style.color = 'var(--danger)';
          playWarningSound();
          alert(`⚠️ WARNING: WEIGHT LIMIT EXCEEDED!\n\nVehicle Capacity: ${activeVeh.capacity} kg\nSelected Load: ${proposed} kg\nExceeds limit by ${proposed - activeVeh.capacity} kg!`);
        } else {
          proposedWeightDisplay.style.color = 'var(--primary)';
        }
      };

      availPkgs.forEach(p => {
        const isCurrentlyOnVeh = p.vehicle === activeVeh.id;
        const item = createElement('label', {
          className: 'check-item pkg-check',
          children: [
            createElement('input', {
              attributes: { type: 'checkbox', 'data-weight': p.totalWeight, ...(isCurrentlyOnVeh ? { checked: 'checked' } : {}) },
              onChange: calculateProposedLoad
            }),
            createElement('div', {
              children: [
                createElement('strong', { textContent: p.name }),
                createElement('div', { textContent: `ID: ${p.id} | Weight: ${p.totalWeight} kg`, styles: { fontSize: '11px', color: 'var(--text-muted)' } })
              ]
            })
          ]
        });
        pkgCheckboxList.appendChild(item);
      });

      // Confirm Allocation Action Button
      const confirmAllocationBtn = createElement('button', {
        className: 'btn btn-primary w-100 mt-2',
        textContent: 'Save & Confirm Load Allocation',
        onClick: () => {
          let totalSelWeight = 0;
          const selectedPids = [];
          pkgCheckboxList.querySelectorAll('.pkg-check input').forEach(input => {
            if (input.checked) {
              const pid = input.getAttribute('data-pid') || input.parentElement.querySelector('strong').textContent;
              const target = availPkgs.find(pkg => pkg.name === pid || pkg.id === pid);
              if (target) {
                totalSelWeight += target.totalWeight;
                selectedPids.push(target.id);
              }
            }
          });

          if (totalSelWeight > activeVeh.capacity) {
            playWarningSound();
            alert(`Cannot confirm allocation! Weight exceeds capacity by ${totalSelWeight - activeVeh.capacity} kg.`);
            return;
          }

          // Update packages state
          store.packages = store.packages.map(p => {
            if (selectedPids.includes(p.id)) {
              return { ...p, vehicle: activeVeh.id, status: 'Allocated' };
            } else if (p.vehicle === activeVeh.id) {
              // Unchecked package previously on this vehicle
              return { ...p, vehicle: null, status: 'Pending' };
            }
            return p;
          });

          // Update vehicle load
          store.vehicles = store.vehicles.map(v => v.id === activeVeh.id ? { ...v, load: totalSelWeight } : v);

          alert(`Load allocation saved successfully for ${activeVeh.id}! Total Load: ${totalSelWeight} kg.`);
          renderAllocateScreen();
        }
      });

      mainWrap.appendChild(Card([
        createElement('h4', { textContent: 'Allocate Packages to Vehicle', className: 'mb-3' }),
        vehCheckboxList,
        Divider(),
        createElement('h5', { textContent: `Vehicle Details — ${activeVeh.id} (${activeVeh.reg})`, className: 'mb-2' }),
        Field('Driver Mobile Number', driverPhoneInput),
        Field('Co-Driver Name', coDriverNameInput),
        Field('Co-Driver Mobile Number', coDriverPhoneInput),
        Field('Destination', destInput),
        saveDriverDetailsBtn,

        createElement('div', { className: 'flex-between mb-3', children: [storesBtn, pdfBtn, loadingToggleBtn] }),
        Divider(),

        pkgCheckboxList,
        proposedWeightDisplay,
        confirmAllocationBtn
      ]));
    };

    renderAllocateScreen();
    container.appendChild(mainWrap);

  } else if (activeTab === 'tracking') {
    container.appendChild(Card([
      createElement('h4', { textContent: 'Vehicle Radar Tracker', className: 'mb-2' }),
      createElement('p', { textContent: 'Real-time location simulation of assigned branch fleet', styles: { fontSize: '12px', color: 'var(--text-muted)' } }),
      renderRadarMap(myVehicles)
    ]));
  }

  return container;
}

// ──────────────────────────────────────────────────────────────
//  STORES DETAILS MODAL
// ──────────────────────────────────────────────────────────────
function showStoresModal(veh, pkgs) {
  const modalOverlay = createElement('div', {
    className: 'modal-overlay flex-center animate-fade-in',
    styles: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, padding: '20px' }
  });

  const modalContent = Card([
    createElement('div', { className: 'flex-between mb-3', children: [
      createElement('h4', { textContent: `Stores on ${veh.id} (${pkgs.length} Packages)` }),
      createElement('button', { className: 'btn btn-text', textContent: '✕', onClick: () => modalOverlay.remove() })
    ]}),

    pkgs.length === 0
      ? createElement('p', { textContent: 'No packages loaded on this vehicle.', styles: { color: 'var(--text-muted)', margin: '20px 0' } })
      : createElement('div', {
          styles: { maxHeight: '350px', overflowY: 'auto' },
          children: pkgs.map(p => createElement('div', {
            className: 'p-3 mb-2',
            styles: { background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border)' },
            children: [
              createElement('div', { className: 'flex-between', children: [
                createElement('div', { textContent: p.name, styles: { fontWeight: 'bold', color: 'var(--primary)' } }),
                createElement('div', { className: 'flex-center', styles: { gap: '6px' }, children: [
                  Pill(`${p.totalWeight} kg`, '#2563eb'),
                  createElement('button', {
                    className: 'btn btn-danger-text p-1',
                    innerHTML: Icons.Trash,
                    attributes: { title: 'Delete Package' },
                    onClick: () => {
                      if (confirm(`Delete package ${p.name} (${p.id})?`)) {
                        store.deletePackage(p.id);
                        modalOverlay.remove();
                      }
                    }
                  })
                ]})
              ]}),
              createElement('div', { className: 'mt-2', styles: { fontSize: '11px', color: 'var(--text-muted)' }, children: [
                createElement('div', { textContent: 'Items:' }),
                ...p.items.map(it => createElement('div', { textContent: `• ${it.name} — ${it.weight} kg`, styles: { marginLeft: '8px' } }))
              ]})
            ]
          }))
        }),

    Divider(),

    createElement('div', { className: 'flex-end', children: [
      createElement('button', { className: 'btn btn-primary', textContent: 'Close Stores View', onClick: () => modalOverlay.remove() })
    ]})
  ], { styles: { width: '100%', maxWidth: '550px' } });

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

// ──────────────────────────────────────────────────────────────
//  ROLE 3: FLEET MANAGER (MTJCO — John)
// ──────────────────────────────────────────────────────────────
function renderFleetManagerDashboard() {
  const container = createElement('div', { className: 'p-4 max-w-1000' });
  container.appendChild(renderHeader('Fleet Manager (MTJCO)', 'Vehicle Inventory & Serviceability Control (John)'));

  const vehicles = store.vehicles;

  const formWrap = createElement('div', { styles: { display: 'none' } });

  const typeSelect = createElement('select', { className: 'input-field' });
  VEHICLE_TYPES.forEach(t => {
    const opt = document.createElement('option'); opt.value = t; opt.textContent = t; typeSelect.appendChild(opt);
  });

  const capInput        = createElement('input', { className: 'input-field', attributes: { type: 'number', placeholder: 'Capacity (kg) e.g., 8000' } });
  const regInput        = createElement('input', { className: 'input-field', attributes: { placeholder: 'Registration No (e.g., DL-01-AB12)' } });
  const idNoInput       = createElement('input', { className: 'input-field', attributes: { placeholder: 'Identity No (e.g., VL-ID-9999)' } });
  const driverInput     = createElement('input', { className: 'input-field', attributes: { placeholder: 'Driver Name' } });
  const driverPhoneInput= createElement('input', { className: 'input-field', attributes: { placeholder: 'Driver Mobile Number' } });
  const coDriverInput   = createElement('input', { className: 'input-field', attributes: { placeholder: 'Co-Driver Name' } });
  const coDriverPhoneIn = createElement('input', { className: 'input-field', attributes: { placeholder: 'Co-Driver Mobile Number' } });

  // Status option: Serviceable vs Unserviceable ONLY (Removed Moving / Not Moving)
  const statusSelect    = createElement('select', { className: 'input-field' });
  VEHICLE_STATUSES.forEach(s => {
    const opt = document.createElement('option'); opt.value = s; opt.textContent = s; statusSelect.appendChild(opt);
  });

  const handleAddVehicle = () => {
    const type = typeSelect.value;
    const cap  = parseFloat(capInput.value);
    const reg  = regInput.value.trim();
    const idNo = idNoInput.value.trim();
    const driver = driverInput.value.trim();
    const status = statusSelect.value;

    if (!cap || !reg || !idNo || !driver) {
      alert('Please fill out mandatory fields (Capacity, Reg No, Identity No, Driver Name).');
      return;
    }

    const newVeh = {
      id: `VEH-${String(vehicles.length + 1).padStart(3, '0')}`,
      type, capacity: cap, load: 0, reg, identityNo: idNo,
      driver, driverPhone: driverPhoneInput.value.trim(),
      coDriver: coDriverInput.value.trim() || 'N/A', coDriverPhone: coDriverPhoneIn.value.trim(),
      status, loadingStatus: 'Loading Pending', assignedTo: null, destination: '', convoyId: null,
      pos: { x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 80) + 10 }
    };

    const list = store.vehicles;
    list.push(newVeh);
    store.vehicles = list;

    alert(`Vehicle ${newVeh.id} created successfully!`);
    formWrap.style.display = 'none';
  };

  formWrap.appendChild(Card([
    createElement('h4', { textContent: 'Register New Vehicle to Fleet', className: 'mb-3' }),
    Field('Vehicle Type', typeSelect),
    Field('Payload Capacity (kg)', capInput),
    Field('Registration Number', regInput),
    Field('Identity Number', idNoInput),
    Field('Driver Name', driverInput),
    Field('Driver Mobile Number', driverPhoneInput),
    Field('Co-Driver Name', coDriverInput),
    Field('Co-Driver Mobile Number', coDriverPhoneIn),
    Field('Initial Vehicle State (Serviceable / Unserviceable)', statusSelect),
    createElement('div', { className: 'flex-between mt-3', children: [
      createElement('button', { className: 'btn btn-secondary', textContent: 'Cancel', onClick: () => { formWrap.style.display = 'none'; } }),
      createElement('button', { className: 'btn btn-primary', textContent: 'Save Vehicle', onClick: handleAddVehicle })
    ]})
  ]));

  const vehCards = vehicles.map(v => {
    // Serviceable / Unserviceable selector ONLY
    const stateSel = createElement('select', {
      className: 'input-field btn-sm',
      styles: { width: '140px', padding: '4px 8px' },
      onChange: (e) => {
        const nextState = e.target.value;
        store.vehicles = store.vehicles.map(item => item.id === v.id ? { ...item, status: nextState } : item);
      }
    });

    VEHICLE_STATUSES.forEach(st => {
      const opt = document.createElement('option');
      opt.value = st; opt.textContent = st;
      if (st === v.status) opt.selected = true;
      stateSel.appendChild(opt);
    });

    return Card([
      createElement('div', { className: 'flex-between mb-2', children: [
        createElement('div', { children: [
          createElement('strong', { textContent: `${v.id} (${v.type})`, styles: { fontSize: '15px' } }),
          createElement('div', { textContent: `Reg: ${v.reg} | ID: ${v.identityNo}`, styles: { fontSize: '11px', color: 'var(--text-muted)' } })
        ]}),
        createElement('div', { className: 'flex-center', styles: { gap: '6px' }, children: [
          Pill(v.status, StatusColors[v.status]),
          createElement('button', {
            className: 'btn btn-danger-text p-1',
            innerHTML: Icons.Trash,
            attributes: { title: 'Delete Vehicle' },
            onClick: () => {
              if (confirm(`Are you sure you want to delete vehicle ${v.id} (${v.reg})?`)) store.deleteVehicle(v.id);
            }
          })
        ]})
      ]}),
      createElement('div', { className: 'grid-2 mb-2', styles: { fontSize: '12px', gap: '6px' }, children: [
        createElement('div', { textContent: `Driver: ${v.driver} (${v.driverPhone || 'N/A'})` }),
        createElement('div', { textContent: `Co-Driver: ${v.coDriver} (${v.coDriverPhone || 'N/A'})` }),
        createElement('div', { textContent: `Capacity: ${v.capacity} kg` }),
        createElement('div', { textContent: `Assigned Branch: ${v.assignedTo || 'Unassigned'}` })
      ]}),
      Divider(),
      createElement('div', { className: 'flex-between', children: [
        createElement('span', { textContent: 'Update Serviceability:', styles: { fontSize: '12px', color: 'var(--text-muted)' } }),
        stateSel
      ]})
    ], { className: 'mb-3' });
  });

  container.appendChild(Card([
    createElement('div', { className: 'flex-between mb-3', children: [
      createElement('div', { children: [
        createElement('h4', { textContent: 'Fleet Inventory & Serviceability Control' }),
        createElement('p', { textContent: `Total ${vehicles.length} fleet vehicles registered`, styles: { fontSize: '12px', color: 'var(--text-muted)' } })
      ]}),
      createElement('button', {
        className: 'btn btn-primary',
        innerHTML: `${Icons.Plus} Add Vehicle`,
        onClick: () => { formWrap.style.display = formWrap.style.display === 'none' ? 'block' : 'none'; }
      })
    ]}),
    formWrap,
    createElement('div', { children: vehCards })
  ]));

  return container;
}

// ──────────────────────────────────────────────────────────────
//  ROLE 4: DISPATCH OFFICER (ADJUTANT — Gurbir)
// ──────────────────────────────────────────────────────────────
function renderDispatchOfficerDashboard() {
  const container = createElement('div', { className: 'p-4 max-w-1000' });
  const activeTab = store.activePage || 'dashboard';

  container.appendChild(renderHeader('Dispatch Officer (Adjutant)', 'Convoy Creation, Fleet Allocation & Log Monitoring (Gurbir)'));

  // Updated Sub-Nav Tabs: Added "Create Convoy" and "View Convoy"
  const navTabs = [
    { id: 'dashboard', label: 'Overview', icon: Icons.BarChart },
    { id: 'nsqm_list',  label: 'Branch Managers', icon: Icons.People },
    { id: 'create_convoy', label: 'Create Convoy', icon: Icons.Plus },
    { id: 'view_convoy', label: 'View Convoys', icon: Icons.Truck },
    { id: 'logs',      label: 'Clearance Log', icon: Icons.Broadcast }
  ];

  const subNav = createElement('div', {
    className: 'sub-nav mb-4 flex-center',
    styles: { gap: '8px', overflowX: 'auto' },
    children: navTabs.map(t => createElement('button', {
      className: `btn ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'} btn-sm`,
      innerHTML: `${t.icon} <span style="margin-left:4px;">${t.label}</span>`,
      onClick: () => { store.activePage = t.id; }
    }))
  });
  container.appendChild(subNav);

  const vehicles = store.vehicles;
  const packages = store.packages;
  const convoys  = store.convoys;

  if (activeTab === 'dashboard') {
    const fleetStats = {
      Serviceable:   vehicles.filter(v => v.status === 'Serviceable').length,
      Unserviceable: vehicles.filter(v => v.status === 'Unserviceable').length
    };

    const fleetPieData = [
      { label: 'Serviceable',   value: fleetStats.Serviceable,   color: StatusColors.Serviceable },
      { label: 'Unserviceable', value: fleetStats.Unserviceable, color: StatusColors.Unserviceable }
    ];

    const loadStats = {
      Loaded:     vehicles.filter(v => v.loadingStatus === 'Loading Done').length,
      Pending:    vehicles.filter(v => v.loadingStatus === 'Loading Pending').length,
      Dispatched: packages.filter(p => p.status === 'Dispatched').length
    };

    const loadPieData = [
      { label: 'Loading Done',    value: loadStats.Loaded,     color: StatusColors['Loading Done'] },
      { label: 'Loading Pending', value: loadStats.Pending,    color: StatusColors['Loading Pending'] },
      { label: 'Dispatched Pkgs', value: loadStats.Dispatched, color: StatusColors.Dispatched }
    ];

    container.appendChild(createElement('div', {
      className: 'grid-2 mb-4',
      styles: { gap: '16px' },
      children: [
        Card([
          createElement('h4', { textContent: 'Fleet Serviceability' }),
          generatePieChart(fleetPieData, 160)
        ]),
        Card([
          createElement('h4', { textContent: 'Global Cargo State' }),
          generatePieChart(loadPieData, 160)
        ])
      ]
    }));

  } else if (activeTab === 'nsqm_list') {
    const nsqms = store.users.filter(u => u.role === 'Branch Manager');

    const nsqmCards = nsqms.map(mgr => {
      const assignedVehs = vehicles.filter(v => v.assignedTo === mgr.id);
      const unassignedVehs = vehicles.filter(v => !v.assignedTo);

      const handleAllocateVeh = () => {
        if (unassignedVehs.length === 0) { alert('No unassigned vehicles available.'); return; }
        const vid = prompt(`Available Vehicles:\n${unassignedVehs.map(v => `${v.id} (${v.type})`).join('\n')}\n\nEnter Vehicle ID to allocate to ${mgr.name}:`);
        if (!vid) return;

        const targetVeh = unassignedVehs.find(v => v.id.toUpperCase() === vid.trim().toUpperCase());
        if (!targetVeh) { alert('Invalid Vehicle ID or already assigned.'); return; }

        store.vehicles = store.vehicles.map(v => v.id === targetVeh.id ? { ...v, assignedTo: mgr.id } : v);
        alert(`Vehicle ${targetVeh.id} allocated exclusively to ${mgr.name} (${mgr.id})!`);
        store.activePage = 'nsqm_list';
      };

      return Card([
        createElement('div', { className: 'flex-between mb-2', children: [
          createElement('div', { children: [
            createElement('h4', { textContent: mgr.name }),
            createElement('div', { textContent: `Branch Manager ID: ${mgr.id}`, styles: { fontSize: '11px', color: 'var(--text-muted)' } })
          ]}),
          createElement('button', { className: 'btn btn-primary btn-sm', textContent: '+ Allocate Vehicle', onClick: handleAllocateVeh })
        ]}),
        Divider(),
        createElement('strong', { textContent: `Assigned Vehicles (${assignedVehs.length}):`, styles: { fontSize: '12px' } }),
        assignedVehs.length === 0
          ? createElement('p', { textContent: 'No vehicles currently allocated to this manager.', styles: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' } })
          : createElement('div', {
              className: 'mt-2',
              children: assignedVehs.map(v => createElement('div', {
                className: 'flex-between p-2 mb-1',
                styles: { background: 'var(--bg-dark)', borderRadius: '6px', fontSize: '12px', border: '1px solid var(--border)' },
                children: [
                  createElement('span', { textContent: `${v.id} (${v.type}) — Reg: ${v.reg}` }),
                  createElement('div', { className: 'flex-center', styles: { gap: '6px' }, children: [
                    Pill(v.status, StatusColors[v.status]),
                    createElement('button', {
                      className: 'btn btn-danger-text p-1',
                      innerHTML: Icons.Trash,
                      attributes: { title: 'Remove Allocation from this Branch Manager' },
                      onClick: () => {
                        if (confirm(`Unassign vehicle ${v.id} from ${mgr.name}?`)) store.unassignVehicle(v.id);
                      }
                    })
                  ]})
                ]
              }))
            })
      ], { className: 'mb-3' });
    });

    container.appendChild(Card([
      createElement('h4', { textContent: 'Branch Managers & Vehicle Allocation', className: 'mb-3' }),
      createElement('div', { children: nsqmCards })
    ]));

  } else if (activeTab === 'create_convoy') {
    // NEW TAB: CREATE CONVOY (Select vehicles with checkboxes & group into convoy)
    const convoyNameIn = createElement('input', { className: 'input-field', attributes: { placeholder: 'e.g., Convoy Bravo' } });
    const availVehs = vehicles.filter(v => v.status === 'Serviceable');

    const checkList = createElement('div', { className: 'mt-3 mb-3' });
    checkList.appendChild(createElement('label', { className: 'label', textContent: 'Select Vehicles to include in Convoy (Tick checkboxes)' }));

    availVehs.forEach(v => {
      const isAlreadyInConvoy = !!v.convoyId;
      const item = createElement('label', {
        className: 'check-item veh-convoy-check',
        children: [
          createElement('input', {
            attributes: { type: 'checkbox', 'data-vid': v.id, ...(isAlreadyInConvoy ? { disabled: 'disabled' } : {}) }
          }),
          createElement('div', {
            children: [
              createElement('strong', { textContent: `${v.id} (${v.type})` }),
              createElement('div', { textContent: `Reg: ${v.reg} | Driver: ${v.driver} | Load Status: ${v.loadingStatus}`, styles: { fontSize: '11px', color: 'var(--text-muted)' } }),
              isAlreadyInConvoy ? Pill(`In ${v.convoyId}`, '#2563eb') : null
            ]
          })
        ]
      });
      checkList.appendChild(item);
    });

    const handleCreateConvoy = () => {
      const cName = convoyNameIn.value.trim() || `Convoy-${convoys.length + 1}`;
      const selectedVids = [];
      checkList.querySelectorAll('.veh-convoy-check input').forEach(input => {
        if (input.checked && !input.disabled) {
          selectedVids.push(input.getAttribute('data-vid'));
        }
      });

      if (selectedVids.length === 0) {
        alert('Please select at least 1 vehicle using the checkboxes to create a convoy.');
        return;
      }

      const newCnv = store.createConvoy(cName, selectedVids);
      alert(`Convoy ${newCnv.name} (${newCnv.id}) created with ${selectedVids.length} vehicles!\nDetails dispatched to Checkpoints.`);
      store.activePage = 'view_convoy';
    };

    container.appendChild(Card([
      createElement('h4', { textContent: 'Create New Convoy', className: 'mb-3' }),
      Field('Convoy Name / Call Sign', convoyNameIn),
      checkList,
      createElement('button', { className: 'btn btn-primary w-100 mt-2', textContent: 'Dispatch & Create Convoy', onClick: handleCreateConvoy })
    ]));

  } else if (activeTab === 'view_convoy') {
    // NEW TAB: VIEW CONVOYS AS SINGLE ENTITIES (Click to view vehicles inside)
    const convoyCards = convoys.map(cnv => {
      const cnvVehs = vehicles.filter(v => cnv.vehicleIds.includes(v.id));

      const showVehsState = { open: false };
      const vehListWrap = createElement('div', { className: 'mt-3', styles: { display: 'none' } });

      vehListWrap.appendChild(createElement('strong', { textContent: `Vehicles in ${cnv.name}:`, styles: { fontSize: '12px' } }));
      cnvVehs.forEach(v => {
        vehListWrap.appendChild(createElement('div', {
          className: 'p-2 mt-1 mb-1 flex-between',
          styles: { background: 'var(--bg-dark)', borderRadius: '6px', fontSize: '12px', border: '1px solid var(--border)' },
          children: [
            createElement('span', { textContent: `${v.id} (${v.type}) — Driver: ${v.driver}` }),
            Pill(v.status, StatusColors[v.status])
          ]
        }));
      });

      return Card([
        createElement('div', { className: 'flex-between mb-2', children: [
          createElement('div', { children: [
            createElement('h4', { textContent: `${cnv.name} (${cnv.id})`, styles: { color: 'var(--primary)' } }),
            createElement('div', { textContent: `Total Vehicles: ${cnv.vehicleIds.length} | Created: ${cnv.createdTime}`, styles: { fontSize: '11px', color: 'var(--text-muted)' } })
          ]}),
          createElement('div', { className: 'flex-center', styles: { gap: '6px' }, children: [
            Pill(`Status: ${cnv.currentCP}`, '#059669'),
            createElement('button', {
              className: 'btn btn-danger-text p-1',
              innerHTML: Icons.Trash,
              attributes: { title: 'Delete Convoy' },
              onClick: () => {
                if (confirm(`Are you sure you want to delete ${cnv.name} (${cnv.id})?`)) {
                  store.deleteConvoy(cnv.id);
                }
              }
            })
          ]})
        ]}),

        createElement('div', { className: 'grid-3 mb-2 mt-3', children: [
          StatBox('Expected Vehicles', cnv.expectedCount, 'var(--primary)'),
          StatBox('Passed Vehicles', cnv.passedCount, '#059669'),
          StatBox('Breakdowns', cnv.breakdownCount || 0, '#dc2626')
        ]}),

        Divider(),

        createElement('div', { className: 'flex-between', children: [
          createElement('span', { textContent: `Notes: ${cnv.notes || 'None'}`, styles: { fontSize: '11px', color: 'var(--text-muted)' } }),
          createElement('button', {
            className: 'btn btn-secondary btn-sm',
            textContent: showVehsState.open ? 'Hide Vehicles' : 'View Vehicles in Convoy',
            onClick: () => {
              showVehsState.open = !showVehsState.open;
              vehListWrap.style.display = showVehsState.open ? 'block' : 'none';
            }
          })
        ]}),

        vehListWrap
      ], { className: 'mb-3' });
    });

    container.appendChild(Card([
      createElement('h4', { textContent: `Active Convoys (${convoys.length})`, className: 'mb-3' }),
      convoys.length === 0
        ? createElement('p', { textContent: 'No active convoys. Go to "Create Convoy" tab to dispatch one.', styles: { color: 'var(--text-muted)' } })
        : createElement('div', { children: convoyCards })
    ]));

  } else if (activeTab === 'logs') {
    container.appendChild(Card([
      createElement('h4', { textContent: 'Live Checkpoint Clearance Log', className: 'mb-2' }),
      renderClearanceLog()
    ]));
  }

  return container;
}

// ──────────────────────────────────────────────────────────────
//  ROLE 5: CEO (HEEMANSHU)
// ──────────────────────────────────────────────────────────────
function renderCEODashboard() {
  const container = createElement('div', { className: 'p-4 max-w-1000' });
  container.appendChild(renderHeader('CEO Executive Command', 'Monitoring Window (Heemanshu)'));

  const vehicles = store.vehicles;

  const fleetStats = {
    Serviceable:   vehicles.filter(v => v.status === 'Serviceable').length,
    Unserviceable: vehicles.filter(v => v.status === 'Unserviceable').length
  };

  const pieData = [
    { label: 'Serviceable',   value: fleetStats.Serviceable,   color: StatusColors.Serviceable },
    { label: 'Unserviceable', value: fleetStats.Unserviceable, color: StatusColors.Unserviceable }
  ];

  container.appendChild(createElement('div', {
    className: 'grid-2 mb-4',
    styles: { gap: '16px' },
    children: [
      Card([
        createElement('h4', { textContent: 'Fleet Serviceability' }),
        generatePieChart(pieData, 170)
      ]),
      Card([
        createElement('h4', { textContent: 'Live Clearance Stream' }),
        renderClearanceLog()
      ])
    ]
  }));

  container.appendChild(Card([
    createElement('h4', { textContent: 'Active Convoy Location Radar', className: 'mb-2' }),
    renderRadarMap(vehicles.filter(v => v.status === 'Serviceable' || v.loadingStatus === 'Loading Done'))
  ]));

  return container;
}

// ──────────────────────────────────────────────────────────────
//  ROLE 6: CHECKPOINT GUARD (CMP) — Breakdown Adjustment & Convoy Single Entity
// ──────────────────────────────────────────────────────────────
function renderCheckpointGuardDashboard() {
  const container = createElement('div', { className: 'p-4 max-w-1000' });
  const cpId = store.currentUser?.checkpoint || 'CP-1';
  const cpObj = CHECKPOINTS.find(c => c.id === cpId) || CHECKPOINTS[0];

  container.appendChild(renderHeader(`Checkpoint Guard — ${cpObj.id}`, `${cpObj.name} • User: ${store.userId}`));

  const convoys = store.convoys;

  const handleConvoyCheckpointAction = (cnv) => {
    const passedInput = prompt(`Convoy ${cnv.name} (${cnv.id})\nExpected Vehicles: ${cnv.expectedCount}\n\nEnter number of vehicles that PASSED checkpoint:`, cnv.expectedCount);
    if (passedInput === null) return;

    const passedCount = parseInt(passedInput, 10);
    if (isNaN(passedCount) || passedCount < 0) {
      alert('Invalid vehicle count.');
      return;
    }

    const breakdownCount = Math.max(0, cnv.expectedCount - passedCount);
    let noteText = '';

    if (breakdownCount > 0) {
      noteText = prompt(`⚠️ ${breakdownCount} vehicle(s) damaged/breakdown in transit!\n\nEnter breakdown reason/notes for Adjutant log:`, `${breakdownCount} vehicle(s) damaged`) || `${breakdownCount} vehicle(s) breakdown`;
    }

    const status = breakdownCount > 0 ? 'Passed with Breakdowns' : 'Passed Full Convoy';

    store.updateConvoyCheckpoint(cnv.id, cpObj.id, status, passedCount, breakdownCount, noteText);

    alert(`Convoy ${cnv.name} processed at ${cpObj.id}!\nPassed: ${passedCount} vehicles\nBreakdowns/Damaged: ${breakdownCount}\nNext Checkpoint will expect: ${passedCount} vehicles.`);
    store.activePage = 'dashboard';
  };

  const convoyCards = convoys.map(cnv => Card([
    createElement('div', { className: 'flex-between mb-2', children: [
      createElement('div', { children: [
        createElement('h4', { textContent: `${cnv.name} (${cnv.id})`, styles: { color: 'var(--primary)' } }),
        createElement('div', { textContent: `Current Location: ${cnv.currentCP} | Created: ${cnv.createdTime}`, styles: { fontSize: '11px', color: 'var(--text-muted)' } })
      ]}),
      Pill(`Expected: ${cnv.expectedCount} Veh`, '#2563eb')
    ]}),

    createElement('div', { className: 'grid-2 mb-3 mt-3', children: [
      StatBox('Expected Vehicles', cnv.expectedCount, 'var(--primary)'),
      StatBox('Reported Breakdowns', cnv.breakdownCount || 0, '#dc2626')
    ]}),

    createElement('button', {
      className: 'btn btn-primary w-100 mt-2',
      textContent: 'Update Convoy Pass & Breakdown Status',
      onClick: () => handleConvoyCheckpointAction(cnv)
    })
  ], { className: 'mb-3' }));

  container.appendChild(Card([
    createElement('h4', { textContent: `Active Convoys at ${cpObj.id}`, className: 'mb-3' }),
    convoys.length === 0
      ? createElement('p', { textContent: 'No active convoys assigned.', styles: { color: 'var(--text-muted)' } })
      : createElement('div', { children: convoyCards })
  ]));

  return container;
}

// ──────────────────────────────────────────────────────────────
//  CLEARANCE LOG COMPONENT
// ──────────────────────────────────────────────────────────────
function renderClearanceLog() {
  const logs = store.convoyLog;
  if (logs.length === 0) {
    return createElement('p', { textContent: 'No clearance updates recorded yet.', styles: { color: 'var(--text-muted)', padding: '20px', textAlign: 'center' } });
  }

  return createElement('div', {
    styles: { maxHeight: '300px', overflowY: 'auto', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' },
    children: logs.map(l => createElement('div', {
      className: 'p-2 mb-2',
      styles: { borderLeft: `4px solid ${StatusColors[l.status] || 'var(--primary)'}`, background: '#ffffff', borderRadius: '4px', fontSize: '12px', border: '1px solid var(--border)' },
      children: [
        createElement('div', { className: 'flex-between', children: [
          createElement('strong', { textContent: `[${l.cpId}] Convoy ${l.convoyId || l.vehId}` }),
          createElement('span', { textContent: l.timestamp, styles: { color: 'var(--text-muted)', fontSize: '10px' } })
        ]}),
        createElement('div', { textContent: `Status: ${l.status} | Passed: ${l.passedCount || 1} veh ${l.note}`, styles: { color: StatusColors[l.status] || 'var(--text-main)', marginTop: '2px' } })
      ]
    }))
  });
}

// ──────────────────────────────────────────────────────────────
//  RADAR MAP SIMULATION COMPONENT
// ──────────────────────────────────────────────────────────────
function renderRadarMap(vehiclesList) {
  const mapWrap = createElement('div', {
    className: 'radar-map mt-3',
    styles: { position: 'relative', height: '260px', background: '#0f172a', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }
  });

  mapWrap.appendChild(createElement('div', { styles: { position: 'absolute', inset: 0, border: '1px solid rgba(59,130,246,0.2)', borderRadius: '50%', margin: '20px' } }));
  mapWrap.appendChild(createElement('div', { styles: { position: 'absolute', inset: 0, border: '1px solid rgba(59,130,246,0.2)', borderRadius: '50%', margin: '70px' } }));

  vehiclesList.forEach(v => {
    const pin = createElement('div', {
      className: 'radar-pin',
      styles: {
        position: 'absolute',
        left: `${v.pos.x}%`,
        top: `${v.pos.y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        textAlign: 'center'
      },
      onClick: () => alert(`Vehicle ${v.id}\nType: ${v.type}\nReg: ${v.reg}\nStatus: ${v.status}\nDriver: ${v.driver}`)
    });

    pin.appendChild(createElement('div', {
      styles: {
        width: '12px', height: '12px', borderRadius: '50%',
        backgroundColor: StatusColors[v.status] || 'var(--primary)',
        boxShadow: `0 0 10px ${StatusColors[v.status] || 'var(--primary)'}`
      }
    }));
    pin.appendChild(createElement('div', {
      textContent: v.id,
      styles: { fontSize: '9px', color: '#fff', marginTop: '2px', textShadow: '0 0 4px #000' }
    }));

    mapWrap.appendChild(pin);
  });

  return mapWrap;
}
