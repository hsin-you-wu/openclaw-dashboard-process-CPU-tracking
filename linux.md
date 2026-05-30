# OpenClaw CPU Monitor - Linux Deployment Guide

Complete guide to deploy and run OpenClaw CPU monitoring dashboard on Linux.

## 📋 System Requirements

- **Linux Operating System** (Ubuntu, Debian, CentOS, Fedora, etc.)
- **Node.js** >= 14.x
- **Python 3** >= 3.6
- **pgrep** command-line tool (usually pre-installed)

## 📦 Quick Installation

### 1️⃣ Clone Repository

```bash
cd ~
git clone <repository-url> openclaw-dashboard-process-CPU-tracking
cd openclaw-dashboard-process-CPU-tracking
```

### 2️⃣ Install Node.js Dependencies

```bash
npm install
```

### 3️⃣ Verify Python Environment

```bash
# Check Python 3
python3 --version

# Should output Python 3.6+
```

## 🔧 Configuration

### Environment Variables

Create `.env` file or export environment variables directly:

```bash
# Dashboard port (default 7000)
export DASHBOARD_PORT=7000

# OpenClaw workspace directory
export WORKSPACE_DIR=$HOME/.openclaw/workspace

# OpenClaw configuration directory
export OPENCLAW_DIR=$HOME/.openclaw

# Agent ID (default main)
export OPENCLAW_AGENT=main
```

### Auto-load Environment Variables

Add to `~/.bashrc` or `~/.zshrc`:

```bash
export DASHBOARD_PORT=7000
export WORKSPACE_DIR=$HOME/.openclaw/workspace
export OPENCLAW_DIR=$HOME/.openclaw
export OPENCLAW_AGENT=main
```

Then reload:

```bash
source ~/.bashrc
# or
source ~/.zshrc
```

## 🚀 Running

### Method 1: Direct Run (Testing)

```bash
node server.js
```

Example output:
```
🚀 Dashboard running on http://localhost:7000
🦞 WebSocket Connection successful
```

### Method 2: Background Run

```bash
# Run with nohup
nohup node server.js > dashboard.log 2>&1 &

# Or use screen
screen -S openclaw-dashboard
node server.js
# Press Ctrl+A then D to detach the screen session
```

### Method 3: As Systemd Service (Recommended)

#### Create Service File

```bash
sudo tee /etc/systemd/system/openclaw-dashboard.service > /dev/null << 'EOF'
[Unit]
Description=OpenClaw Dashboard
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/openclaw-dashboard-process-CPU-tracking
Environment="DASHBOARD_PORT=7000"
Environment="WORKSPACE_DIR=$HOME/.openclaw/workspace"
Environment="OPENCLAW_DIR=$HOME/.openclaw"
Environment="OPENCLAW_AGENT=main"
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

#### Enable and Start Service

```bash
# Reload systemd config
sudo systemctl daemon-reload

# Enable auto-start on boot
sudo systemctl enable openclaw-dashboard

# Start the service
sudo systemctl start openclaw-dashboard

# Check service status
sudo systemctl status openclaw-dashboard
```

#### View Logs

```bash
# View logs in real-time
sudo journalctl -u openclaw-dashboard -f

# View last 50 lines of logs
sudo journalctl -u openclaw-dashboard -n 50

# View logs from a specific time period
sudo journalctl -u openclaw-dashboard --since "1 hour ago"
```

## 🧪 Testing

### Test 1: Verify OpenClaw Process

```bash
# Check if OpenClaw process is running
pgrep yes

# Should output PID (e.g.: 12345)
```

### Test 2: Test Python Monitoring Script

```bash
# Get CPU info of OpenClaw process
python3 openclaw_monitor.py $(pgrep yes)

# Expected output (JSON format):
# {
#   "pid": 12345,
#   "name": "yes",
#   "cpu_total": 25.50,
#   "cpu_user": 20.10,
#   "cpu_system": 5.40
# }
```

### Test 3: Test Server

```bash
# Start the server
node server.js

# Test API in another terminal
curl http://localhost:7000
```

### Test 4: Access Dashboard

Open in browser:
```
http://localhost:7000
```

## 📊 Monitoring Workflow

```
┌─────────────────────────────────────────────┐
│      Frontend (index.html)                   │
│    Display CPU usage visualization          │
└────────────────┬────────────────────────────┘
                 │ WebSocket
                 ▼
┌─────────────────────────────────────────────┐
│     Node.js Backend (server.js)             │
│  Invoke Python script to get CPU data       │
└────────────────┬────────────────────────────┘
                 │ Execute
                 ▼
┌─────────────────────────────────────────────┐
│  Python Script (openclaw_monitor.py)        │
│  Read /proc filesystem to calculate CPU     │
└─────────────────────────────────────────────┘
```

## 🔍 Troubleshooting

### ❌ Problem 1: OpenClaw Process Not Found

```bash
# Symptom
pgrep yes
# No output

# Solution
# 1. Check if OpenClaw is running
ps aux | grep openclaw

# 2. If no process, start OpenClaw
# (depends on how OpenClaw is configured)

# 3. Or modify script to find another process name
# Edit the pgrep command in server.js
```

### ❌ Problem 2: Python Script Execution Failed

```bash
# Symptom
python3 openclaw_monitor.py 12345
# Returns error or no output

# Solution
# 1. Check /proc file
cat /proc/12345/stat

# 2. If not found, PID doesn't exist
ps aux | grep -E "12345|openclaw"

# 3. Update PID and try again
python3 openclaw_monitor.py $(pgrep yes)
```

### ❌ Problem 3: WebSocket Connection Failed

```bash
# Symptom
# Frontend displays "WebSocket Disconnected"

# Solution
# 1. Check if server is running
ps aux | grep "node server.js"

# 2. Check if port is open
netstat -tlnp | grep 7000
# or
sudo lsof -i :7000

# 3. If port is occupied, change port
DASHBOARD_PORT=8000 node server.js

# 4. Check firewall
sudo ufw status
sudo ufw allow 7000/tcp
```

### ❌ Problem 4: Permission Denied Error

```bash
# Symptom
# Error: EACCES: permission denied, open '/proc/...

# Solution
# Run with sudo
sudo node server.js

# Or adjust /proc permissions
# (use caution, generally not recommended)
```

### ❌ Problem 5: CPU Data is Zero

```bash
# Symptom
# Frontend displays openclaw_cpu_user: 0, openclaw_cpu_system: 0

# Possible causes
# 1. Process just started, no CPU time consumed yet
# 2. Process is in idle state
# 3. Sampling interval too short

# Solution
# Let the process run for a while before checking
# Or increase the sampling interval time
```

## 📈 Performance Optimization

### Adjust Sampling Interval

Edit `interval` parameter in `openclaw_monitor.py`:

```python
def calculate_cpu(pid, interval=0.5):  # default 0.5 seconds
    # ...
```

- **Shorter interval** (0.1s): More frequent updates, but higher CPU consumption
- **Longer interval** (1.0s): Less frequent updates, but lower CPU consumption

### Adjust WebSocket Push Frequency

Edit `streamInterval` in `server.js`:

```javascript
let streamInterval = setInterval(() => {
  // Push data
}, 500);  // Push every 500ms
```

- **Shorter interval**: Better real-time performance, but higher network overhead
- **Longer interval**: Lower network overhead, but slower data updates

## 🔐 Security Recommendations

### 1. Restrict Access

Allow only local and Tailscale access:

```bash
# Check firewall rules
sudo ufw status

# Allow only local access
sudo ufw allow from 127.0.0.1 to any port 7000

# Allow Tailscale access (optional)
sudo ufw allow from 100.64.0.0/10 to any port 7000
```

### 2. Use HTTPS Reverse Proxy

Use Nginx or Caddy as reverse proxy with HTTPS enabled:

```nginx
server {
    listen 443 ssl;
    server_name your.domain;

    ssl_certificate /path/to/cert;
    ssl_certificate_key /path/to/key;

    location / {
        proxy_pass http://localhost:7000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### 3. Use Strong Password

Set a strong password on first access (recommended 12+ characters).

## 📊 Multiple OpenClaw Instances Monitoring

If multiple OpenClaw processes are running:

```bash
# View all OpenClaw processes
pgrep -a yes

# Example output
# 12345 yes
# 12346 yes
# 12347 yes
```

The dashboard will automatically monitor all processes and display them separately on the frontend.

## 🚀 Advanced Usage

### Customize Process Name

Edit `generateProcessMetrics()` function in `server.js`, replace `pgrep yes` with your process name:

```javascript
const output = execSync('python3 openclaw_monitor.py $(pgrep YOUR_PROCESS_NAME)', {
    encoding: 'utf8',
    timeout: 2000,
    shell: '/bin/bash'
}).trim();
```

### Monitor Multiple Different Processes

Modify script to monitor multiple processes simultaneously:

```bash
# Example: monitor multiple processes
PIDs=$(pgrep -a yes | awk '{print $1}')
for PID in $PIDs; do
    python3 openclaw_monitor.py $PID
done
```

### Export Data to Time Series Database

You can export CPU data to time series databases like InfluxDB, Prometheus, etc.

## 📚 Reference Resources

- [Linux /proc filesystem documentation](https://man7.org/linux/man-pages/man5/proc.5.html)
- [Systemd service management](https://www.freedesktop.org/software/systemd/man/systemctl.html)
- [Node.js documentation](https://nodejs.org/en/docs/)
- [Python documentation](https://docs.python.org/3/)

## 🆘 Need Help?

### Check System Information

```bash
# Operating system info
uname -a
lsb_release -a

# Node.js version
node --version
npm --version

# Python version
python3 --version

# CPU info
nproc
cat /proc/cpuinfo | head -20
```

### Collect Diagnostic Information

```bash
# Create diagnostic report
{
    echo "=== System Info ==="
    uname -a
    echo ""
    echo "=== Node.js ==="
    node --version
    echo ""
    echo "=== Python ==="
    python3 --version
    echo ""
    echo "=== Process Check ==="
    pgrep -a yes
    echo ""
    echo "=== Port Check ==="
    netstat -tlnp | grep 7000
    echo ""
    echo "=== Recent Logs ==="
    journalctl -u openclaw-dashboard -n 20
} > diagnostic_report.txt

cat diagnostic_report.txt
```

## 📝 Quick Command Reference

```bash
# Start service
sudo systemctl start openclaw-dashboard

# Stop service
sudo systemctl stop openclaw-dashboard

# Restart service
sudo systemctl restart openclaw-dashboard

# Check status
sudo systemctl status openclaw-dashboard

# View real-time logs
sudo journalctl -u openclaw-dashboard -f

# Enable auto-start on boot
sudo systemctl enable openclaw-dashboard

# Disable auto-start on boot
sudo systemctl disable openclaw-dashboard

# View all OpenClaw processes
pgrep -a yes

# Test Python script
python3 openclaw_monitor.py $(pgrep yes)

# Check port
sudo lsof -i :7000
```

---

**Last Updated**: 2026-05-29
**Documentation Version**: 1.0
