import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory / file-based storage path
const DB_FILE = path.join(__dirname, 'warehouse_db.json');

// Helper to read DB
function getDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch {
      // Fallback
    }
  }
  return {
    items: [],
    transactionsIn: [],
    transactionsOut: [],
  };
}

// Helper to save DB
function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Warehouse Management API running smoothly', timestamp: new Date() });
});

app.get('/api/items', (req, res) => {
  const db = getDB();
  res.json(db.items);
});

app.post('/api/items', (req, res) => {
  const db = getDB();
  const newItem = {
    id: `item-${Date.now()}`,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  db.items.unshift(newItem);
  saveDB(db);
  res.status(201).json(newItem);
});

app.get('/api/transactions/in', (req, res) => {
  const db = getDB();
  res.json(db.transactionsIn);
});

app.get('/api/transactions/out', (req, res) => {
  const db = getDB();
  res.json(db.transactionsOut);
});

// Serve frontend build if exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server API Pergudangan berjalan di http://localhost:${PORT}`);
});

