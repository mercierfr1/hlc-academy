// Create a test user for login
// Run this in the browser console or add to a page

// Test user credentials
const testUser = {
    firstName: "Test",
    lastName: "User", 
    email: "test@hlcacademy.com",
    password: "password123"
};

// Create the user if it doesn't exist
try {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find(user => user.email === testUser.email);
    
    if (!userExists) {
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            email: testUser.email,
            password: testUser.password,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: {
                experience: "Beginner",
                profitability: "Not profitable yet",
                obstacle: "Overtrading",
                screenTime: "3+ hours",
                accountSize: "Under $1,000",
                winVision: "Consistent profits",
                phone: "+1234567890"
            },
            progress: {
                currentModule: 1,
                completedModules: [],
                totalXP: 150,
                dailyXP: 25,
                streak: 3
            },
            preferences: {
                notifications: true,
                emailUpdates: true,
                theme: 'light'
            }
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        console.log('✅ Test user created successfully!');
        console.log('📧 Email: test@hlcacademy.com');
        console.log('🔑 Password: password123');
    } else {
        console.log('ℹ️ Test user already exists!');
        console.log('📧 Email: test@hlcacademy.com');
        console.log('🔑 Password: password123');
    }
    
    console.log('🚀 You can now log in with these credentials!');
    
} catch (error) {
    console.error('❌ Error creating test user:', error);
}
