# Backend - TVU Faculty of IT Management API

## 🏗️ Cấu trúc thư mục (Node.js Industry-Standard)

```
backend/
├── src/
│   ├── app.js                          # Entry point
│   ├── config/
│   │   └── index.js                    # Cấu hình app (port, db, upload)
│   ├── constants/
│   │   └── index.js                    # TABLE_MAP, HTTP_STATUS
│   ├── database/
│   │   ├── index.js                    # MySQL connection pool
│   │   └── migrations/                 # SQL migration files
│   ├── modules/
│   │   └── admin/
│   │       ├── controllers/
│   │       │   └── admin.controller.js # HTTP request/response only
│   │       ├── services/
│   │       │   └── admin.service.js    # Business logic
│   │       ├── routes/
│   │       │   └── admin.routes.js     # Route definitions
│   │       ├── models/
│   │       │   └── admin.model.js      # Entity/table mapping
│   │       ├── dto/
│   │       │   ├── create-admin.dto.js # Payload → DB columns (CREATE)
│   │       │   └── update-admin.dto.js # Payload → DB columns (UPDATE)
│   │       ├── validators/
│   │       │   └── admin.validator.js  # Input validation
│   │       └── repositories/
│   │           └── admin.repository.js # All SQL queries
│   ├── middleware/
│   │   └── upload.middleware.js        # Multer image upload
│   ├── common/
│   │   ├── utils/
│   │   │   └── slugify.js              # Slugify helper
│   │   ├── helpers/
│   │   │   └── index.js                # Shared helpers
│   │   └── errors/
│   │       ├── AppError.js             # Custom error classes
│   │       └── errorHandler.js         # Global error middleware
│   ├── logs/
│   │   └── winston.js                  # Logger
│   ├── docs/
│   │   └── api.md                      # API documentation
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
├── .env
├── .env.example
└── package.json
```

## 🔄 Request Flow (5 tầng)
```
Client → Routes → Middleware → Controllers → Services → Repositories → Database
```

## 🚀 Chạy server
```bash
npm run dev     # Development (hot reload)
npm start       # Production
npm run seed    # Seed dữ liệu mẫu
```

## 📡 API Base URL
`http://localhost:5000/api/v1/admin`
