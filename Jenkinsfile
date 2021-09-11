import hudson.model.*
import hudson.EnvVars
import groovy.json.JsonSlurperClassic
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import java.net.URL
import java.net.URLEncoder

def DEPLOYMENT_OBJECT
@NonCPS
def jsonParse(def json) {
    new groovy.json.JsonSlurperClassic().parseText(json)
}

pipeline {

    agent any 

    environment {
        IMAGE_NAME = 'AQUI VA EL REPOSITORIO DE ECR'
        AWS_REGION = 'us-west-2'
        AWS_ACCOUNT = 'AQUI VA LA CUENTA AWS'
        IMAGE_TAG = getShortCommitId()
        ENVIRONMENT = getEnvironment()
    }

    stages {

        stage('Build imagen API Rest') {
        
            steps {
                script {
                    def imageTag = "${IMAGE_TAG}"
                    def imageName = "${IMAGE_NAME}:${imageTag}"
                    def repositoryName = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${imageName}"
                    sh "\$(aws ecr get-login --no-include-email --region ${AWS_REGION})"
                    sh "docker build -t ${imageName} ."
                    sh "docker tag ${imageName} ${repositoryName}"
                }
            }
        }

        stage ('Push Image') {
            steps {
                script {
                    def imageTag = "${IMAGE_TAG}"
                    def imageName = "${IMAGE_NAME}:${imageTag}"
                    def repositoryName = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${imageName}"
                    sh "docker push ${repositoryName}"
                }
            }
        }
}

def getEnvironment() {
    return (isMaster())?'prd')
}

def getFixedImageTag() {
    return (isMaster())?'prd')
}

def isMaster() {
    return env.BRANCH_NAME == "master"
}

def getShortCommitId() {
    def gitCommit = env.GIT_COMMIT
    def shortGitCommit = "${gitCommit[0..6]}"
    return shortGitCommit
}

}
