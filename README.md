# 📌 Finance Tracker API

A simple **CRUD API** built with **Fastify** and deployed on **AWS Lambda**.  

---

## 🚀 Features
- Create, Read, Update, Delete (CRUD) transactions  
- Summary endpoint for income/expense by category  
- Built with **Fastify** framework 
- Uses **AWS DynamoDB** as the database  
- Runs locally with in-memory server (`ts-node`)  
- Deployable on **AWS Lambda** with API Gateway  

## ⚙️ Installation

Clone the repo and install dependencies:

```bash
git clone <finance-tracker-repo-url>
cd finance-tracker
npm install
```

---

## 🧑‍💻 Running Locally

1. Start the local dev server:
   ```bash
   npm run dev
   ```
   This uses `ts-node` to run `src/server.ts`.

2. This will run api on 3000 port
   ```
   Server listening on http://localhost:3000
   ```

---

## 📬 API Endpoints

### 1. Create Transaction
**POST** `/transactions`  
```json
{
  "amount": 25000,
  "type": "income",
  "category": "salary",
  "description": "monthly salary"
}
```

### 2. Get All Transactions
**GET** `/transactions`

### 3. Get Transaction by ID
**GET** `/transactions/:id`  
Example: `/transactions/1`

### 4. Update Transaction
**PUT** `/transactions/:id`  
```json
{
  "amount": 300,
  "type": "expense",
  "category": "food",
  "description": "dinner out"
}
```

### 5. Delete Transaction
**DELETE** `/transactions/:id`

### 6. Summary
**GET** `/summary`  
Response:
```json
{
  "salary": { "income": 25000, "expense": 0 },
  "food": { "income": 0, "expense": 300 }
}
```


---

## 🧪 Testing with Postman

1. Import the collection in postman using **finance-tracker.postman_collection.json** file from the repository.  

2. Use the endpoints above to test:  
   - POST → Add new transactions  
   - GET → Retrieve list/summary  
   - PUT/DELETE → Modify or remove  

---

## 🚀 Deployment on AWS Lambda

1. Build the project:
   ```bash
   npm run build
   ```
2. Package with production dependencies (use the `lambda-function.sh` script).  
3. Upload `function.zip` to AWS Lambda.  

---
