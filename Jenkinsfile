pipeline{
    agent any 
    
    stages{
        stage("Version Check"){
            steps{
                sh '''
                    node -v
                    npm -v
                '''
            }
        }
    }
}