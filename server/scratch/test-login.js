async function test() {
  try {
    console.log('Sending login request to http://localhost:5000/api/auth/login...');
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173' // Simulate CORS request from Vite
      },
      body: JSON.stringify({
        email: 'admin@mohitdecodes.com',
        password: 'Admin@123456'
      })
    });
    
    console.log('STATUS CODE:', response.status);
    console.log('HEADERS:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
  } catch (err) {
    console.error('ERROR OCCURRED:', err.message);
  }
}

test();
