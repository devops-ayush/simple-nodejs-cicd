const express = require('express');
const cors = require('cors');
const os = require('os');
const path = require('path');
const _ = require('lodash'); // intentionally outdated version (for audit practice)

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// OS info
app.get('/api/os', (req, res) => {
  res.json({ hostname: os.hostname(), platform: os.platform() });
});

// Echo
app.post('/api/echo', (req, res) => {
  res.json({ youSent: req.body });
});

// Simple compute (intentionally unsafe 'eval' to demonstrate code smell/vuln for scanners)
app.get('/api/compute', (req, res) => {
  const { expr } = req.query;
  if (!expr) return res.status(400).json({ error: 'expr required' });
  try {
    // WARNING: Do not use eval in real code. This is here only so Sonar/linters flag it.
    // eslint-disable-next-line no-eval
    const value = eval(expr);
    if (!_.isNumber(value) && !_.isString(value)) {
      return res.status(400).json({ error: 'expression did not return a number/string' });
    }
    res.json({ result: value });
  } catch (e) {
    res.status(400).json({ error: 'invalid expression' });
  }
});

// Serve index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
