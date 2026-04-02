# 🚀 Quick Start Guide - Monolith Banking App

## ✨ Features at a Glance

✅ Complete account management (SAVINGS, CURRENT, DEPOSIT, LOAN)
✅ Secure JWT authentication with refresh tokens
✅ Deposit, Withdraw, and Fund Transfer operations
✅ Transaction history with detailed records
✅ Loan application with admin approval workflow
✅ Professional React UI with error handling
✅ H2 in-memory database (dev) with MySQL support

---

## 📋 System Requirements

| Component | Requirement |
|-----------|------------|
| Java | 25+ |
| Node.js | 18+ |
| Maven | 3.9+ |
| npm | 10+ |
| RAM | 2GB+ |
| Disk | 500MB+ |

---

## 🎯 5-Minute Setup

### Step 1: Build Backend (1 min)
```powershell
cd backend
mvn clean package -DskipTests
```

### Step 2: Start Backend (30 sec)
```powershell
java -jar target/monolith-bank-1.0.0.jar
```
✅ Wait for: `Tomcat started on port 8080`

### Step 3: Start Frontend (2 min)
```powershell
cd frontend
npm start
```
✅ Browser opens automatically to `http://localhost:3000`

### Step 4: Login & Explore (1.5 min)
- **Register**: Click "Register" link
- **Create Account**: Enter username, email, password
- **Login**: Use credentials to sign in
- **Create Account**: Click "+ Create New Account"
- **Test Features**: Deposit, Withdraw, Transfer

---

## 👤 Test Credentials (Pre-populated)

```
Admin Account:
- Username: admin
- Email: admin@bank.com
- Password: admin123
- Role: ADMIN (loan approval)

Manager Account:
- Username: manager
- Email: manager@bank.com
- Password: manager123
- Role: MANAGER

Customer Account:
- Username: john_doe
- Email: john@bank.com
- Password: john123
- Role: CUSTOMER
```

---

## 🎮 Using the Application

### Create Account

1. Click **Accounts** tab (default view)
2. Click **"+ Create New Account"** button
3. **Select Account Type**:
   - **SAVINGS**: Regular savings (approved immediately)
   - **CURRENT**: Business account (approved immediately)
   - **DEPOSIT**: Fixed deposit (approved immediately)
   - **LOAN**: Loan application (⏳ pending admin approval)
4. **Enter Opening Deposit** (e.g., 5000.00)
5. Click **"Create Account"** button
6. ✅ Account created and displayed in list

### Deposit Money

1. Find account in **Accounts** tab
2. Enter amount in **"Deposit Amount"** field
3. Click **"Deposit"** button
4. ✅ Balance updates immediately

### Withdraw Money

1. Find account in **Accounts** tab
2. Enter amount in **"Withdraw Amount"** field
3. Click **"Withdraw"** button
4. ✅ Balance updates immediately

### Transfer Funds

1. Scroll down to **"Fund Transfer"** section
2. Enter **From Account** number (e.g., ACC001)
3. Enter **To Account** number (e.g., ACC002)
4. Enter **Amount** (e.g., 1000.00)
5. Click **"Transfer Funds"** button
6. ✅ Transfer successful, balances updated

### View Transaction History

1. Click **Transactions** tab
2. View all transactions in table format:
   - ID: Transaction identifier
   - Account: Account number
   - Type: DEPOSIT, WITHDRAW, TRANSFER
   - Amount: Shows + (credit) or − (debit)
   - Date: Transaction date

### Manage Payees

1. Click **Payees** tab
2. Enter payee name and account number
3. Click **"Add Payee"** button
4. ✅ Payee saved in your list
5. Use saved payees for faster transfers

### Logout

1. Click **"Logout"** button (top-right)
2. ✅ Session cleared, redirected to login page

---

## 🔧 API Endpoints (Backend)

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login (get tokens)
POST   /api/auth/refresh-token  - Refresh access token
```

### Accounts
```
GET    /api/accounts/me         - Get user's accounts
POST   /api/accounts            - Create new account
GET    /api/accounts/{id}       - Get account details
POST   /api/accounts/approve-loan - Approve loan (admin)
```

### Transactions
```
GET    /api/transactions/search - Get transaction history
POST   /api/transactions/deposit - Deposit to account
POST   /api/transactions/withdraw - Withdraw from account
POST   /api/transactions/transfer - Transfer between accounts
```

### Users
```
GET    /api/users/profile       - Get user profile
PUT    /api/users/{id}          - Update user
GET    /api/users               - List all users (admin)
```

---

## 📊 API Testing with Swagger

1. Backend must be running
2. Open: `http://localhost:8080/swagger-ui.html`
3. Click endpoint to expand
4. Click **"Try it out"**
5. Enter parameters
6. Click **"Execute"**

**Example: Create Account**
```
POST /api/accounts
Authorization: Bearer <your-token>
Content-Type: application/json

Body:
{
  "accountType": "SAVINGS",
  "initialDeposit": 5000.00
}
```

---

## 📂 Project Structure

```
monolith-bank/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/example/    # Java source code
│   │   ├── auth/                     # Authentication
│   │   ├── account/                  # Account management
│   │   ├── transaction/              # Transaction operations
│   │   ├── user/                     # User management
│   │   └── config/                   # Configuration
│   ├── src/main/resources/
│   │   ├── application-dev.yml       # Dev config (H2)
│   │   ├── application-prod.yml      # Prod config (MySQL)
│   │   ├── schema.sql                # Database schema
│   │   └── data.sql                  # Sample data
│   ├── target/                       # Compiled artifacts
│   │   └── monolith-bank-1.0.0.jar   # Executable JAR
│   └── pom.xml                       # Maven dependencies
│
├── frontend/                         # React application
│   ├── public/                       # Static assets
│   ├── src/                          # Source code
│   │   ├── components/               # React components
│   │   │   ├── App.js               # Main router
│   │   │   ├── Login.js             # Login form
│   │   │   ├── Register.js          # Registration form
│   │   │   ├── CustomerDashboard.js # Account management
│   │   │   ├── AdminDashboard.js    # Admin features
│   │   │   └── ManagerDashboard.js  # Manager features
│   │   ├── index.js                 # Entry point
│   │   └── App.css                  # Styling
│   ├── package.json                 # Dependencies
│   └── node_modules/                # Installed packages
│
├── IMPLEMENTATION_SUMMARY.md         # Complete overview
├── BEFORE_AFTER_COMPARISON.md        # Bug fixes detail
├── QUICK_START.md                    # This file
└── README.md                         # General info
```

---

## 🐛 Troubleshooting

### Issue: "Port 8080 already in use"
**Solution**: 
```powershell
Get-Process java | Stop-Process -Force
# Then restart backend
```

### Issue: "Cannot find node_modules"
**Solution**:
```powershell
cd frontend
npm install
npm start
```

### Issue: "transactions.map is not a function"
**Solution**: Already fixed! ✅ Updated code handles null/undefined responses

### Issue: "CORS error in browser"
**Solution**: Backend CORS is configured. Try:
1. Hard refresh (Ctrl+F5)
2. Clear browser cache
3. Restart both servers

### Issue: "401 Unauthorized"
**Solution**: Token expired or invalid
1. Logout and login again
2. Check localStorage in DevTools (F12)
3. Token should be present in `jwtToken`

### Issue: "H2 Console not accessible"
**Solution**: Backend must be running
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:bankdb`
- Username: `SA`
- Password: (empty)

---

## 🔐 Security Features

✅ **JWT Token**: 15-minute access + refresh token
✅ **Password Hashing**: BCrypt encryption
✅ **CORS Protection**: Configured for localhost:3000
✅ **Input Validation**: All fields validated
✅ **Error Handling**: Graceful error messages
✅ **Token Refresh**: Automatic token refresh
✅ **Role-Based Access**: CUSTOMER/MANAGER/ADMIN

---

## 📊 Database

### Development (Default)
- **Type**: H2 (In-memory)
- **URL**: `jdbc:h2:mem:bankdb`
- **Advantage**: Fast, no setup required
- **Disadvantage**: Data lost on restart

### Production (Optional)
- **Type**: MySQL 8.0.33
- **Config**: `application-prod.yml`
- **Activation**: Set `--spring.profiles.active=prod`

---

## 🎨 UI Features

✅ Responsive Design (works on mobile)
✅ Tab-based Navigation
✅ Color-coded Buttons
✅ Error Alert Messages
✅ Form Validation
✅ Transaction Table
✅ Account Cards
✅ Professional Styling

---

## 📱 Browser Support

| Browser | Status |
|---------|--------|
| Chrome | ✅ Fully Supported |
| Firefox | ✅ Fully Supported |
| Safari | ✅ Fully Supported |
| Edge | ✅ Fully Supported |
| IE 11 | ❌ Not Supported |

---

## 🚀 Performance Tips

1. **Faster Builds**: Use `-DskipTests` flag
   ```powershell
   mvn clean package -DskipTests
   ```

2. **Development Mode**: Frontend auto-reloads on save
   ```
   npm start  # Already includes hot reload
   ```

3. **Production Build**: Optimize React app
   ```powershell
   npm run build  # Creates optimized build in build/ folder
   ```

---

## 📝 Useful Commands

```powershell
# Backend
cd backend
mvn clean package          # Build JAR
mvn clean package -DskipTests  # Skip tests
java -jar target/monolith-bank-1.0.0.jar  # Run app

# Frontend
cd frontend
npm install                # Install dependencies
npm start                  # Start dev server
npm run build              # Create production build
npm test                   # Run tests

# Database
# H2 Console: http://localhost:8080/h2-console
# Swagger API: http://localhost:8080/swagger-ui.html

# Kill processes
Get-Process java | Stop-Process -Force  # Stop all Java
```

---

## 📞 Support Resources

1. **API Documentation**: `http://localhost:8080/swagger-ui.html`
2. **H2 Console**: `http://localhost:8080/h2-console`
3. **Browser Console**: Press F12 → Console tab
4. **Backend Logs**: Check terminal output
5. **Frontend Logs**: Browser DevTools → Console

---

## ✅ Verification Checklist

After startup, verify everything works:

- [ ] Backend running on `http://localhost:8080`
- [ ] Frontend accessible at `http://localhost:3000`
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can create account (all types)
- [ ] Can deposit to account
- [ ] Can withdraw from account
- [ ] Can transfer between accounts
- [ ] Can view transaction history
- [ ] Can add payees
- [ ] Can logout successfully
- [ ] Error messages display properly

---

## 🎉 Ready to Use!

Your monolith banking application is ready to explore!

**Start the servers and begin banking!** 🏦💰

---

## 📄 Additional Documentation

- `IMPLEMENTATION_SUMMARY.md` - Comprehensive feature overview
- `BEFORE_AFTER_COMPARISON.md` - Detailed bug fixes
- Backend `README.md` - Java/Spring Boot details
- Frontend `package.json` - Dependencies list

---

**Last Updated**: April 2, 2026
**Status**: ✅ Production Ready (Dev Build)
