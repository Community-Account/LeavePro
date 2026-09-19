import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'src', 'data', 'db.json');
const PORT = 5000;

function readData() {
  const content = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(content);
}

function writeData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  const data = readData();

  let cleanPath = pathname;
  if (cleanPath.startsWith('/api')) {
    cleanPath = cleanPath.slice(4);
  }
  if (cleanPath.endsWith('/') && cleanPath.length > 1) {
    cleanPath = cleanPath.slice(0, -1);
  }
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  if (cleanPath === '/' && req.method === 'GET') {
    sendResponse(res, 200, {
      name: 'LeavePro Mock REST API',
      status: 'online',
      endpoints: {
        users: `http://localhost:${PORT}/api/users`,
        departments: `http://localhost:${PORT}/api/departments`,
        leaveTypes: `http://localhost:${PORT}/api/leave-types`,
        leaveRequests: `http://localhost:${PORT}/api/leave-requests`,
        login: `http://localhost:${PORT}/api/auth/login`,
        db: `http://localhost:${PORT}/api/db`
      }
    });
    return;
  }

  if ((cleanPath === '/db' || cleanPath === '/api/db') && req.method === 'GET') {
    sendResponse(res, 200, data);
    return;
  }

  if (cleanPath === '/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    const user = data.users.find(u => u.email === body.email && u.password === body.password);
    if (user) {
      const { password, ...safeUser } = user;
      sendResponse(res, 200, { user: safeUser, token: 'mock-token-' + user.id });
    } else {
      sendResponse(res, 401, { message: 'Invalid email or password' });
    }
    return;
  }

  if (cleanPath === '/users' && req.method === 'GET') {
    const safeUsers = data.users.map(({ password, ...u }) => u);
    sendResponse(res, 200, safeUsers);
    return;
  }

  const userMatch = cleanPath.match(/^\/users\/([^/]+)$/);
  if (userMatch && req.method === 'GET') {
    const user = data.users.find(u => String(u.id) === String(userMatch[1]));
    if (user) {
      const { password, ...safeUser } = user;
      sendResponse(res, 200, safeUser);
    } else {
      sendResponse(res, 404, { message: 'User not found' });
    }
    return;
  }

  if (cleanPath === '/users' && req.method === 'POST') {
    const body = await parseBody(req);
    const newId = String(Date.now());
    const newUser = {
      id: newId,
      name: body.name || '',
      email: body.email || '',
      password: body.password || '123456',
      role: body.role || 'employee',
      department_id: String(body.department_id || '1'),
      status: body.status || 'Active',
      created_at: new Date().toISOString().split('T')[0]
    };
    data.users.push(newUser);
    writeData(data);
    const { password, ...safeNewUser } = newUser;
    sendResponse(res, 201, safeNewUser);
    return;
  }

  if ((cleanPath === '/departments' || cleanPath === '/department') && req.method === 'GET') {
    sendResponse(res, 200, data.departments);
    return;
  }

  if ((cleanPath === '/leave-types' || cleanPath === '/leave_types' || cleanPath === '/leave-type') && req.method === 'GET') {
    sendResponse(res, 200, data.leave_types);
    return;
  }

  if ((cleanPath === '/leave-requests' || cleanPath === '/leave_requests' || cleanPath === '/leave-request') && req.method === 'GET') {
    let requests = [...data.leave_requests];
    const employeeId = searchParams.get('employee_id');
    const status = searchParams.get('status');
    if (employeeId) {
      requests = requests.filter(r => String(r.employee_id) === String(employeeId));
    }
    if (status && status !== 'All') {
      requests = requests.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    sendResponse(res, 200, requests);
    return;
  }

  if ((cleanPath === '/leave-requests' || cleanPath === '/leave_requests' || cleanPath === '/leave-request') && req.method === 'POST') {
    const body = await parseBody(req);
    const newId = String(Date.now());
    const now = new Date().toISOString().split('T')[0];
    const newRequest = {
      id: newId,
      employee_id: String(body.employee_id),
      leave_type_id: String(body.leave_type_id),
      start_date: body.start_date,
      end_date: body.end_date,
      total_days: Number(body.total_days),
      reason: body.reason,
      status: 'Pending',
      approved_by: null,
      created_at: now,
      updated_at: now
    };
    data.leave_requests.push(newRequest);
    writeData(data);
    sendResponse(res, 201, newRequest);
    return;
  }

  const approveMatch = cleanPath.match(/^\/(?:leave-requests|leave_requests)\/([^/]+)\/approve$/);
  if (approveMatch && req.method === 'PUT') {
    const body = await parseBody(req);
    const reqItem = data.leave_requests.find(r => String(r.id) === String(approveMatch[1]));
    if (reqItem) {
      reqItem.status = 'Approved';
      reqItem.approved_by = body.approved_by || 'Manager';
      reqItem.updated_at = new Date().toISOString().split('T')[0];
      writeData(data);
      sendResponse(res, 200, reqItem);
    } else {
      sendResponse(res, 404, { message: 'Leave request not found' });
    }
    return;
  }

  const rejectMatch = cleanPath.match(/^\/(?:leave-requests|leave_requests)\/([^/]+)\/reject$/);
  if (rejectMatch && req.method === 'PUT') {
    const body = await parseBody(req);
    const reqItem = data.leave_requests.find(r => String(r.id) === String(rejectMatch[1]));
    if (reqItem) {
      reqItem.status = 'Rejected';
      reqItem.approved_by = body.approved_by || 'Manager';
      reqItem.updated_at = new Date().toISOString().split('T')[0];
      writeData(data);
      sendResponse(res, 200, reqItem);
    } else {
      sendResponse(res, 404, { message: 'Leave request not found' });
    }
    return;
  }

  const singleReqMatch = cleanPath.match(/^\/(?:leave-requests|leave_requests)\/([^/]+)$/);
  if (singleReqMatch) {
    const id = singleReqMatch[1];
    const index = data.leave_requests.findIndex(r => String(r.id) === String(id));
    if (req.method === 'GET') {
      if (index !== -1) {
        sendResponse(res, 200, data.leave_requests[index]);
      } else {
        sendResponse(res, 404, { message: 'Leave request not found' });
      }
      return;
    }
    if (req.method === 'PUT' || req.method === 'PATCH') {
      if (index !== -1) {
        const body = await parseBody(req);
        data.leave_requests[index] = {
          ...data.leave_requests[index],
          ...body,
          updated_at: new Date().toISOString().split('T')[0]
        };
        writeData(data);
        sendResponse(res, 200, data.leave_requests[index]);
      } else {
        sendResponse(res, 404, { message: 'Leave request not found' });
      }
      return;
    }
  }

  const balanceMatch = cleanPath.match(/^\/(?:leave-balance|leave_balance)\/([^/]+)$/);
  if (balanceMatch && req.method === 'GET') {
    const empId = balanceMatch[1];
    const userApprovedRequests = data.leave_requests.filter(
      r => String(r.employee_id) === String(empId) && r.status === 'Approved'
    );
    const balances = data.leave_types.map(lt => {
      const used = userApprovedRequests
        .filter(r => String(r.leave_type_id) === String(lt.id))
        .reduce((sum, r) => sum + Number(r.total_days), 0);
      return {
        id: lt.id,
        name: lt.name,
        code: lt.code,
        annual_limit: lt.annual_limit,
        used,
        remaining: Math.max(0, lt.annual_limit - used)
      };
    });
    sendResponse(res, 200, balances);
    return;
  }

  const statsMatch = cleanPath.match(/^\/(?:dashboard\/stats|stats)\/([^/]+)$/);
  if (statsMatch && req.method === 'GET') {
    const empId = statsMatch[1];
    const userRequests = data.leave_requests.filter(r => String(r.employee_id) === String(empId));
    const totalLeaves = data.leave_types.reduce((sum, lt) => sum + lt.annual_limit, 0);
    const usedLeaves = userRequests
      .filter(r => r.status === 'Approved')
      .reduce((sum, r) => sum + Number(r.total_days), 0);
    const pendingRequests = userRequests.filter(r => r.status === 'Pending').length;
    sendResponse(res, 200, {
      totalLeaves,
      usedLeaves,
      remainingLeaves: Math.max(0, totalLeaves - usedLeaves),
      pendingRequests
    });
    return;
  }

  sendResponse(res, 404, { message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Mock REST API running on http://localhost:${PORT}/api`);
});
