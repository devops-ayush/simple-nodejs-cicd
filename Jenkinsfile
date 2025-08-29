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
        stage("Install Dependecy"){
            steps{
                sh 'npm install'
            }
        }
        stage("Test"){
            sh 'npm test'
        }
    }
}
