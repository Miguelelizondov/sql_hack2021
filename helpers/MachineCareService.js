const http = require('http')

const options = {
  hostname: 'mcmsapitec.animor.com.mx',
  path: '/apiv1.0/EspecialistaSupervisore/ObtenerEspecialistasDeSupervisorLogeado',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU3VwZXJ2aXNvciAiLCJVc3VhcmlvQWNjZXNvIjoiMmUzOWMyNTAtZjRiYi00NzMzLTk0ODAtNDI3MGZmNjA5NWYwIiwiTGFuZ3VhZ2UiOiIxIiwiRXNwZWNpYWxpc3RhIjoiMWY4M2JlNTgtYjY4OC00YzY5LTg3YjQtNTY1YjllMDQ2MmU3IiwiU3VwZXJ2aXNvciI6ImU5NjFhYTA3LTQwMDQtNDEyZS05OTAzLTI0MTY1ODhkODI2MCIsIm5iZiI6MTYyNjcyMTk1OSwiZXhwIjoxNjI5MzEzOTU5LCJpc3MiOiJodHRwOi8vbWNtc2FwaS5hbmltb3IuY29tLm14LyIsImF1ZCI6Imh0dHA6Ly9tY21zYXBpLmFuaW1vci5jb20ubXgvIn0.aQdU2Rmzfk86DYZblMw6nCILeDFaFJdXuzbI9ii3cto',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

const requestData = () => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      res.setEncoding('utf8');
      let body = ''; 
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
    req.end();
  });
};

module.exports = { requestData };
