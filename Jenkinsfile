pipeline{
    agent any 
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
            }
        }
        stage("Install Dependency"){
            steps{
                sh 'npm install'
            }
        }
        stage("Dependency Check"){
            steps{
                sh 'npm audit'
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
            }
        }
    }
}
