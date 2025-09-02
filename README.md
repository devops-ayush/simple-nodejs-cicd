# DevOps CI Sample (Node.js)

## Folder Structure
- `public/`
- `src/`
- `test/`
- `k8s/`  (Contains k8s manifests deployment.yaml and service.yaml)
- `Dockerfile` (Docker file for image)
- `Jenkinsfile` (Jenkins file for CICD pipeline)
- `README.md`

## Quick Start
```bash
npm ci
npm test
npm run coverage
npm run lint
npm run audit
npm start
```
PORT- 3000

## Endpoints
- `GET /api/health` → `{ status: "ok" }`
- `GET /api/os` → `{ hostname, platform }`
- `POST /api/echo` → echoes JSON

## Jenkins
The jenkins file triggers the CI/CD pipeline for the app. 
It uses two 2 node
Master - Runs the whole pipeline except few stages
Docker - Runs Build,Push and prune image stage

Pipeline Stages

1. Version Check- Checks version of node and npm
2. Install Dependency- It install all dependency mentioned in Package.json using "npm install"
3. Dependency Check- Checks if any high or critical vulnerabilies exist in dependencies using "npm audit --audit-level=high"
4. fix vulnerability- Runs only if there are vulnerabilites are present and stop the pipeline other wise skip this stagr and to check if vulnerability can be auto fix it runs "npm audit fix --force"
5. Test- Runs the test written in test/app.test.js using "npm test" and store result in mocha-resultsxml so result can be seen on UI and store as artifact
6. Check Coverage- It check code coverage using "npm run coverage" and publish the coverage/lcov-report/index.html using publishHTML syntax
7. Build Docker image- Switch to Docker agent and pull the currents changes from github and build the image from Dockerfile
8. Push Image- Push the docker image with commit id tag using variable $GIT_COMMIT to Dockerhub using withDockerRegistry for credentials
9. Update Tag in k8s- Switch back to master agent, Using "sed" it update the commit id tag in k8s deployment.yaml
10. Deploy to k8s- Deploy the app using kubectl by adding kubeconfig file as credential
