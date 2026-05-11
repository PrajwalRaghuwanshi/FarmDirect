// Using native fetch


async function runTest() {
    console.log("🚀 Starting Test Run...");

    const userData = {
        name: "test username",
        mobile: "9999999995",
        email: "testuser5@test.com",
        pincode: 462041,
        address: "Test Address",
        city: "Bhopal",
        state: "Madhya Pradesh",
        languagepreference: "English"
    };

    console.log("1. Registering User:", userData);
    let user;
    try {
        const res = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        console.log("Registration Response:", data);
        user = data.user;
    } catch (err) {
        console.error("Registration failed:", err.message);
        return;
    }

    if (!user) {
        console.error("User not created!");
        return;
    }

    console.log("\n2. Fetching Products for Home Page...");
    // Simulate HomePage.jsx fetch logic
    const apiUrl = "http://localhost:5000";
    // We assume locationInfo or user has state. Here user has state: Madhya Pradesh.
    const targetState = user.state;
    
    let url = targetState 
        ? `${apiUrl}/api/products/by-farmers?state=${encodeURIComponent(targetState)}`
        : `${apiUrl}/products`;

    console.log("Fetching from URL:", url);
    try {
        let res = await fetch(url);
        let data = await res.json();
        let rawProducts = targetState ? (data?.products || []) : (Array.isArray(data) ? data : []);

        if (rawProducts.length === 0 && targetState) {
            console.log("No products found for specific state. Falling back to all products...");
            url = `${apiUrl}/products`;
            res = await fetch(url);
            data = await res.json();
            rawProducts = Array.isArray(data) ? data : [];
        }

        console.log(`\n✅ Final Products fetched for Home Page: ${rawProducts.length} items`);
        if (rawProducts.length > 0) {
            console.log("First Product details:");
            console.log(JSON.stringify(rawProducts[0], null, 2));
        }

    } catch (err) {
        console.error("Failed to fetch products:", err.message);
    }
}

runTest();
