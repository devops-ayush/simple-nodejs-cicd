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
                    script{
                        sh " npm audit --audit-level=high "
                    }
                }
            }
        }   
        stage("fix vulnerability"){
            when {
                expression{
                    currentBuild.result == 'UNSTABLE'
                }    
            }
            steps{
                    sh 'npm audit fix --force'
                    error("Please fix the vulnerabilities and Push again!!!!")
                    
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
            steps{
                sh 'docker build -t ayush966/nodejs:$GIT_COMMIT . '
            }
        }
        stage("Push Image"){
            agent{
                label "Docker"
            }
            steps{
                withDockerRegistry(credentialsId: 'dockerHub-creds') {
                    sh 'docker push ayush966/nodejs:$GIT_COMMIT'
                }
            }
        }       
        stage("Update tag in k8s"){
            steps{
                dir('k8s/') {
                   sh "sed -i 's#ayush966/nodejs:.*#ayush966/nodejs:$GIT_COMMIT#g' deployment.yaml"
                   sh "cat deployment.yaml | grep image:" 
                }
            }
        }
        stage("Deploy to k8s"){
            steps{
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    dir('k8s/'){
                        sh "kubectl apply -f ."
                    }
                }
            }    
        }
    }
    post{
        always{
            node("Docker"){
                script{
                    
                    sh ''' 
                        git pull origin main
                        docker rmi ayush966/nodejs:$(git rev-parse HEAD~2) || true
                    '''
                }
            }
            sh 'curl http://$(curl -s ifconfig.me):30500/api/Health | grep ok '
        }
    }
}