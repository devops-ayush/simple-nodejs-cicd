pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  environment {
    // NodeJS tool (set this name in Manage Jenkins > Global Tool Configuration)
    NODEJS_HOME = tool name: 'Node-18', type: 'nodejs'
    PATH = "${NODEJS_HOME}/bin:${env.PATH}"

    // Optional: SonarQube scanner path (configure in Global Tool Configuration)
    // SCANNER_HOME = tool 'SonarQubeScanner'

    // Optional: SonarQube server name (Configure System > SonarQube Servers)
    // SONARQUBE_SERVER = 'MySonarQubeServer'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'node -v && npm -v'
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh 'npm run lint'
        }
      }
    }

    stage('Unit Test & Coverage') {
      steps {
        sh 'npm run coverage'
      }
      post {
        always {
          // Publish Mocha JUnit XML results
          junit 'test-results/*.xml'

          // Publish coverage (requires "Coverage" plugin)
          publishCoverage adapters: [lcovAdapter('coverage/lcov.info')], sourceFileResolver: sourceFiles('NEVER_STORE')
        }
      }
    }

    stage('Security Audit (npm audit)') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh 'npm run audit'
        }
      }
    }

    // Uncomment if you have SonarQube configured
    // stage('SonarQube Analysis') {
    //   steps {
    //     withSonarQubeEnv("${SONARQUBE_SERVER}") {
    //       sh """
    //         ${SCANNER_HOME}/bin/sonar-scanner \
    //           -Dsonar.projectKey=devops-ci-sample \
    //           -Dsonar.sources=. \
    //           -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
    //       """
    //     }
    //   }
    // }
  }

  post {
    always {
      archiveArtifacts artifacts: 'test-results/*.xml, coverage/**, npm-debug.log', allowEmptyArchive: true
    }
  }
}
