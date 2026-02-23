const assert = require('assert');

const API_URL = 'http://localhost:5000/api';

async function postData(url, data, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    return response;
}

const runVerification = async () => {
    try {
        console.log('--- Starting Verification ---');

        // 1. Attempt public registration with role: 'admin'
        console.log('\n1. Testing Public Registration Restriction...');
        const randomEmail = `hacker${Math.floor(Math.random() * 10000)}@test.com`;

        try {
            const regRes = await postData(`${API_URL}/auth/register`, {
                name: 'Hacker',
                email: randomEmail,
                password: 'password123',
                role: 'admin' // Trying to force admin
            });
            const regData = await regRes.json();

            if (regData.role === 'voter') {
                console.log('✅ PASSED: User registered as voter despite requesting admin.');
            } else {
                console.error(`❌ FAILED: User registered as ${regData.role}`);
            }
        } catch (error) {
            console.error('❌ FAILED: Registration error', error.message);
        }

        // 2. Login as Main Admin
        console.log('\n2. Logging in as Main Admin...');
        let mainAdminToken;
        try {
            const loginRes = await postData(`${API_URL}/auth/login`, {
                email: 'admin1@test.com',
                password: 'admin123'
            });
            const loginData = await loginRes.json();

            if (!loginRes.ok) throw new Error(loginData.message);

            mainAdminToken = loginData.token;
            console.log('✅ PASSED: Main Admin logged in.');
        } catch (error) {
            console.error('❌ FAILED: Main Admin login failed', error.message);
            return;
        }

        // 3. Create a new Admin using Main Admin credentials
        console.log('\n3. Creating new Admin via Main Admin...');
        const newAdminEmail = `newadmin${Math.floor(Math.random() * 10000)}@test.com`;
        try {
            const createRes = await postData(`${API_URL}/users/create-admin`, {
                name: 'New Admin',
                email: newAdminEmail,
                password: 'password123'
            }, mainAdminToken);

            const createData = await createRes.json();

            if (createData.role === 'admin') {
                console.log('✅ PASSED: New Admin created successfully.');
            } else {
                console.error(`❌ FAILED: New user has role ${createData.role}`);
            }
        } catch (error) {
            console.error('❌ FAILED: Admin creation failed', error.message);
        }

        // 4. Login as the new Admin
        console.log('\n4. Logging in as New Admin...');
        try {
            const adminLoginRes = await postData(`${API_URL}/auth/login`, {
                email: newAdminEmail,
                password: 'password123'
            });
            const adminLoginData = await adminLoginRes.json();

            if (adminLoginData.role === 'admin') {
                console.log('✅ PASSED: New Admin logged in successfully.');
            } else {
                console.error(`❌ FAILED: Logged in user has role ${adminLoginData.role}`);
            }
        } catch (error) {
            console.error('❌ FAILED: New Admin login failed', error.message);
        }

        console.log('\n--- Verification Complete ---');

    } catch (error) {
        console.error('Critical Error:', error.message);
    }
};

runVerification();
