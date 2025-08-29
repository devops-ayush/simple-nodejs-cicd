# DevOps CI Sample (Node.js)

A tiny Express app to practice **Jenkins CI/CD** with:
- ✅ Unit tests (Mocha + Chai + Chai-HTTP)
- ✅ JUnit XML reports (mocha-junit-reporter → `test-results/mocha-results.xml`)
- ✅ Code coverage (NYC/Istanbul → `coverage/lcov.info`)
- ✅ Coverage publish in Jenkins (Coverage plugin)
- ✅ Lint (ESLint)
- ✅ Security audit (`npm audit`) — plus an intentionally outdated `lodash@4.17.20`
- 🔶 Optional SonarQube stage (commented in Jenkinsfile)

## Quick Start
```bash
npm ci
npm test
npm run coverage
npm run lint
npm run audit
npm start
```

Open http://localhost:3000

## Jenkins Setup
- Install plugins: **NodeJS**, **JUnit**, **Coverage** (a.k.a. Code Coverage API).
- Configure NodeJS tool named **`Node-18`**.
- (Optional) Configure SonarQube server + scanner.

Pipeline will:
1. Checkout
2. Install deps (`npm ci`)
3. Lint (non-blocking → marks build UNSTABLE on error)
4. Test + Coverage → publishes JUnit + LCOV
5. Audit (non-blocking → UNSTABLE on issues)
6. (Optional) SonarQube analysis

## Paths Jenkins uses
- JUnit: `test-results/*.xml`
- Coverage (LCOV): `coverage/lcov.info`

## Endpoints
- `GET /api/health` → `{ status: "ok" }`
- `GET /api/os` → `{ hostname, platform }`
- `POST /api/echo` → echoes JSON
- `GET /api/compute?expr=2*3` → 6 (uses `eval` on purpose so scanners flag it)
