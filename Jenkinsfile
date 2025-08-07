@Library('Shared') _

pipeline {
    agent {
        label 'agent1'
    }

    stages {
        stage('Pull code') {
            steps {
                script {
                    pullCode('https://github.com/rahulprajapat8040/iongo_iontube_service.git', 'main')
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test'
            }
        }

        stage('Clean Up node_modules') {
            steps {
                sh 'rm -rf node_modules'
            }
        }

        stage('Docker Compose Down') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Prepare .env') {
            steps {
                script {
                    prepareEnv('sudo nano /etc/jenkins-secrets/envs/iongo-iontube.env')
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                sh 'docker compose up --build'
            }
        }
    }

    post {
        failure {
            echo 'pipeline failed!'
        }
        success {
            echo 'pipeline completed successfully'
        }
    }
}
