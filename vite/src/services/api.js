// LocalStorage-based Mock Backend Engine (Works 100% without a real server)
const STORAGE_KEY = "payvault_mock_db_v1";

const getDB = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial = {
      users: [
        { id: 1, username: "admin", email: "admin@payvault.com", password: "password", role: "admin", balance: 5000.0, created_at: new Date().toISOString() },
        { id: 2, username: "johndoe", email: "john@payvault.com", password: "password", role: "user", balance: 750.0, created_at: new Date().toISOString() }
      ],
      transactions: [
        { id: 1, sender_id: null, recipient_id: 1, amount: 5000.0, type: "Deposit", status: "Completed", created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, sender_id: null, recipient_id: 2, amount: 750.0, type: "Deposit", status: "Completed", created_at: new Date(Date.now() - 43200000).toISOString() }
      ],
      idempotencyKeys: {}
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveDB = (db) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

let currentUserToken = localStorage.getItem("payvault_token") || null;

export const api = {
  login: async (username, password) => {
    const db = getDB();
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) throw { response: { data: { detail: "Invalid username or password" } } };
    
    const token = `mock-token-${user.id}`;
    localStorage.setItem("payvault_token", token);
    currentUserToken = token;
    return { data: { access_token: token, token_type: "bearer", role: user.role, username: user.username } };
  },

  register: async (username, email, password) => {
    const db = getDB();
    if (db.users.some(u => u.username === username)) {
      throw { response: { data: { detail: "Username already taken" } } };
    }
    const newUser = {
      id: db.users.length + 1,
      username,
      email,
      password,
      role: db.users.length === 0 ? "admin" : "user",
      balance: 500.0,
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDB(db);

    const token = `mock-token-${newUser.id}`;
    localStorage.setItem("payvault_token", token);
    currentUserToken = token;
    return { data: { access_token: token, token_type: "bearer", role: newUser.role, username: newUser.username } };
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("payvault_token");
    if (!token) throw new Error("Unauthorized");
    const userId = parseInt(token.replace("mock-token-", ""));
    const db = getDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    return { data: { id: user.id, username: user.username, email: user.email, role: user.role, balance: user.balance } };
  },

  deposit: async (amount) => {
    const token = localStorage.getItem("payvault_token");
    const userId = parseInt(token.replace("mock-token-", ""));
    const db = getDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error("Unauthorized");
    if (amount <= 0) throw { response: { data: { detail: "Amount must be positive" } } };

    user.balance += amount;
    const tx = {
      id: db.transactions.length + 1,
      sender_id: null,
      recipient_id: user.id,
      amount,
      type: "Deposit",
      status: "Completed",
      created_at: new Date().toISOString()
    };
    db.transactions.push(tx);
    saveDB(db);
    return { data: { message: "Deposit successful", balance: user.balance } };
  },

  transfer: async (recipient_username, amount, idempotency_key) => {
    const token = localStorage.getItem("payvault_token");
    const userId = parseInt(token.replace("mock-token-", ""));
    const db = getDB();

    if (idempotency_key && db.idempotencyKeys[idempotency_key]) {
      throw { response: { data: { detail: "Duplicate transaction request detected (Idempotency Key match)" } } };
    }

    const sender = db.users.find(u => u.id === userId);
    const recipient = db.users.find(u => u.username === recipient_username);

    if (!recipient) throw { response: { data: { detail: "Recipient username not found" } } };
    if (sender.id === recipient.id) throw { response: { data: { detail: "Cannot transfer to yourself" } } };
    if (sender.balance < amount) throw { response: { data: { detail: "Insufficient balance" } } };
    if (amount <= 0) throw { response: { data: { detail: "Amount must be positive" } } };

    sender.balance -= amount;
    recipient.balance += amount;

    if (idempotency_key) db.idempotencyKeys[idempotency_key] = true;

    const tx = {
      id: db.transactions.length + 1,
      sender_id: sender.id,
      recipient_id: recipient.id,
      amount,
      type: "Transfer",
      status: "Completed",
      created_at: new Date().toISOString()
    };
    db.transactions.push(tx);
    saveDB(db);
    return { data: { message: "Transfer successful", new_balance: sender.balance } };
  },

  getTransactions: async (page = 1, limit = 10, status = "All") => {
    const token = localStorage.getItem("payvault_token");
    const userId = parseInt(token.replace("mock-token-", ""));
    const db = getDB();

    let userTxs = db.transactions.filter(tx => tx.sender_id === userId || tx.recipient_id === userId);
    if (status && status !== "All") {
      userTxs = userTxs.filter(tx => tx.status === status);
    }

    userTxs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = userTxs.length;
    const paginated = userTxs.slice((page - 1) * limit, page * limit).map(tx => {
      const sender = db.users.find(u => u.id === tx.sender_id);
      const recipient = db.users.find(u => u.id === tx.recipient_id);
      return {
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        sender: sender ? sender.username : "System / Bank",
        recipient: recipient ? recipient.username : "Self",
        created_at: tx.created_at
      };
    });

    return { data: { total, page, limit, transactions: paginated } };
  },

  getAnalytics: async () => {
    const token = localStorage.getItem("payvault_token");
    const userId = parseInt(token.replace("mock-token-", ""));
    const db = getDB();
    const user = db.users.find(u => u.id === userId);

    const txs = db.transactions.filter(tx => tx.sender_id === userId || tx.recipient_id === userId);
    const total_sent = txs.filter(tx => tx.sender_id === userId).reduce((acc, t) => acc + t.amount, 0);
    const total_received = txs.filter(tx => tx.recipient_id === userId).reduce((acc, t) => acc + t.amount, 0);

    return { data: { total_sent, total_received, total_transactions: txs.length, wallet_balance: user ? user.balance : 0 } };
  },

  adminGetUsers: async () => {
    const db = getDB();
    return { data: db.users.map(u => ({ id: u.id, username: u.username, email: u.email, role: u.role, balance: u.balance, created_at: u.created_at })) };
  },

  adminGetTransactions: async () => {
    const db = getDB();
    return {
      data: db.transactions.map(tx => {
        const sender = db.users.find(u => u.id === tx.sender_id);
        const recipient = db.users.find(u => u.id === tx.recipient_id);
        return {
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          status: tx.status,
          sender: sender ? sender.username : "System",
          recipient: recipient ? recipient.username : "Self",
          created_at: tx.created_at
        };
      })
    };
  }
};