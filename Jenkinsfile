pipeline{
    agent {
        label "master"
    }
    tools{
        nodejs 'NodeJS 22.19.0'
    }
    stages{
        stage("Version Check"){
            steps{
                sh '''
                    node -v
                    npm -v
                '''
                echo "$GIT_COMMIT"
            }
        }
        stage("Install Dependency"){
            steps{
                sh 'npm install'
            }
        }
        stage("Dependency Check"){
            steps{
                catchError(buildResult: 'SUCCESS', message: 'Error: Found Vulnerability!!!', stageResult: 'UNSTABLE') {
                    sh 'npm audit'
                }
            }
        }
        stage("fix vulnerability"){
            steps{
                    sh 'npm audit fix --force'
            }
        }
        stage("Test"){
            steps{
                 sh 'npm test'
                 junit allowEmptyResults: true, keepProperties: true, skipMarkingBuildUnstable: true, stdioRetention: 'ALL', testResults: 'test-results/mocha-results.xml'
            }
        }
        stage("Check coverage"){
            steps{
                sh 'npm run coverage'
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, icon: '', keepAll: false, reportDir: 'coverage/lcov-report', reportFiles: 'index.html', reportName: 'HTML Report', reportTitles: '', useWrapperFileDirectly: true])
            }
        }
        stage("Build Docker Image"){
            agent{
                label "Docker"
            }
            when{
                branch "feature/CI"
            }
            steps{
                sh 'docker build -t nodejs:$GIT_COMMIT' .
            }
        }
    }
}
