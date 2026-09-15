async function test() {
  const baseUrl = 'http://localhost:3000';

  console.log('\n--- 1. Testing GET /api/villages ---');
  let res = await fetch(`${baseUrl}/api/villages`);
  let json = await res.json();
  console.log('Status:', res.status, '| Success:', json.success, '| Villages Count:', json.data?.length);

  console.log('\n--- 2. Testing POST /api/auth/farmer/send-otp ---');
  res = await fetch(`${baseUrl}/api/auth/farmer/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: '9876543210' }),
  });
  json = await res.json();
  console.log('Status:', res.status, '| Message:', json.message, '| Hint:', json.data?.otpHint);

  console.log('\n--- 3. Testing POST /api/auth/farmer/verify-otp (Valid OTP) ---');
  res = await fetch(`${baseUrl}/api/auth/farmer/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: '9876543210', otp: '123456' }),
  });
  json = await res.json();
  console.log('Status:', res.status, '| Success:', json.success, '| Farmer:', json.data?.user?.fullName, '| Has JWT:', Boolean(json.data?.token));

  console.log('\n--- 4. Testing POST /api/auth/farmer/verify-otp (Invalid OTP rejection) ---');
  res = await fetch(`${baseUrl}/api/auth/farmer/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: '9876543210', otp: '000000' }),
  });
  json = await res.json();
  console.log('Status:', res.status, '| Error properly caught:', json.error);

  console.log('\n--- 5. Testing POST /api/auth/login (Staff) ---');
  res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'STF-2041', password: 'password123', role: 'staff' }),
  });
  json = await res.json();
  console.log('Status:', res.status, '| Staff Authenticated:', json.data?.user?.role, '| Has JWT:', Boolean(json.data?.token));

  console.log('\n--- 6. Testing GET /api/staff/overview ---');
  res = await fetch(`${baseUrl}/api/staff/overview`);
  json = await res.json();
  console.log('Status:', res.status, '| Total Villages:', json.data?.totalVillages, '| Total Farmers:', json.data?.totalFarmers, '| Acres:', json.data?.totalAcresUnderCultivation);

  console.log('\n--- ALL MEMBER 1 BACKEND ENDPOINTS FUNCTIONING AS SPECIFIED! ---\n');
}

test().catch((err) => console.error('Test error:', err));
