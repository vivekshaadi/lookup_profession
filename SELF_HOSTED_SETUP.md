# Self-Hosted GitHub Actions Runner Setup

This guide will help you set up a self-hosted GitHub Actions runner to automatically deploy your Profession Lookup App when you push to GitHub.

## Benefits of Self-Hosted Runner

✅ **Access to Internal APIs** - Can reach `lookup-service.us-east-1.staging.shaadi.internal`  
✅ **Deploy on Your Infrastructure** - Full control over deployment environment  
✅ **Automatic Deployments** - Triggered by GitHub pushes  
✅ **Cost Effective** - No external hosting fees

## Prerequisites

- A server/machine with:
  - Ubuntu/Linux OS (recommended)
  - Node.js 16+ installed
  - Internet access to GitHub
  - Access to your internal API network
  - Docker (optional, for containerized deployments)

## Step 1: Set Up Self-Hosted Runner

### 1.1 Go to Your GitHub Repository

Navigate to: `https://github.com/vivekshaadi/lookup_profession`

### 1.2 Access Runner Settings

1. Click **Settings** tab
2. Click **Actions** → **Runners** in the left sidebar
3. Click **New self-hosted runner**

### 1.3 Follow GitHub's Instructions

GitHub will provide commands specific to your repository. They'll look like:

```bash
# Download
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure
./config.sh --url https://github.com/vivekshaadi/lookup_profession --token YOUR_TOKEN

# Run
./run.sh
```

### 1.4 Configure as a Service (Recommended)

To run the runner as a background service:

```bash
# Install as service
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

## Step 2: Prepare Your Server

### 2.1 Install Node.js (if not already installed)

```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2.2 Install PM2 (Recommended for Process Management)

```bash
npm install -g pm2

# Optional: Configure PM2 to start on boot
pm2 startup
```

### 2.3 Create Deployment Directory

```bash
# Create a directory for your app
sudo mkdir -p /opt/profession-lookup-app
sudo chown $USER:$USER /opt/profession-lookup-app
```

## Step 3: Test Manual Deployment

Before setting up automatic deployment, test the manual deployment:

### 3.1 Clone and Deploy

```bash
cd /opt/profession-lookup-app
git clone https://github.com/vivekshaadi/lookup_profession.git .
chmod +x deploy.sh
./deploy.sh
```

### 3.2 Verify It Works

```bash
# Check if app is running
curl http://localhost:3001

# Check logs
tail -f app.log
```

## Step 4: Configure GitHub Actions Workflow

The workflow is already created in `.github/workflows/deploy-self-hosted.yml`. It will:

1. ✅ Checkout your code
2. ✅ Install dependencies
3. ✅ Build React app
4. ✅ Stop existing app
5. ✅ Start new version
6. ✅ Verify deployment

## Step 5: Test Automatic Deployment

### 5.1 Make a Test Change

```bash
# Make a small change to trigger deployment
echo "console.log('Deployment test');" >> server.js
git add .
git commit -m "Test automatic deployment"
git push origin main
```

### 5.2 Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Watch the deployment workflow run
3. Check the logs for any issues

## Security Considerations

### Environment Variables

If you need environment variables, add them to your runner:

```bash
# On the runner machine
echo "export API_BASE_URL=http://lookup-service.us-east-1.staging.shaadi.internal" >> ~/.bashrc
source ~/.bashrc
```

### Firewall Configuration

Ensure your runner can access:

- GitHub.com (for runner communication)
- Your internal API endpoints
- Any other required services

### Network Access

Make sure the runner machine can reach:

- `lookup-service.us-east-1.staging.shaadi.internal`
- Any other internal services your app needs

## Troubleshooting

### Runner Not Starting

```bash
# Check runner logs
cd ~/actions-runner
tail -f _diag/Runner_*.log
```

### Deployment Fails

```bash
# Check application logs
tail -f /opt/profession-lookup-app/app.log

# Check if port is in use
netstat -tulpn | grep :3001

# Restart deployment manually
cd /opt/profession-lookup-app
./deploy.sh
```

### API Connection Issues

```bash
# Test internal API access from runner machine
curl -v http://lookup-service.us-east-1.staging.shaadi.internal/lookup/v1/data
```

## Advanced Configuration

### Custom Deployment Path

Edit `.github/workflows/deploy-self-hosted.yml` to change deployment directory:

```yaml
- name: Deploy to custom path
  run: |
    cd /your/custom/path
    ./deploy.sh
```

### Multiple Environments

Create separate workflows for different environments:

- `deploy-staging.yml` (on `develop` branch)
- `deploy-production.yml` (on `main` branch)

### Health Checks

Add health check endpoints to your app and include them in the workflow.

## Monitoring

### Application Monitoring

```bash
# With PM2
pm2 monit

# Manual monitoring
watch -n 5 'curl -s http://localhost:3001 | head -20'
```

### Runner Monitoring

```bash
# Check runner service status
sudo systemctl status actions.runner.vivekshaadi-lookup_profession.*

# Check runner logs
journalctl -u actions.runner.vivekshaadi-lookup_profession.* -f
```

## Support

For issues:

1. Check GitHub Actions logs in your repository
2. Check runner logs on your server
3. Check application logs: `tail -f app.log`
4. Verify network connectivity to internal APIs
