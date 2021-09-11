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
        IMAGE_NAME = 'ibm/backend'
        AWS_REGION = 'us-west-2'
        AWS_ACCOUNT = '987038959406'
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
}

def getEnvironment() {
    return (isDevelop())?'dev':(isRelease()?'qas':(isMaster())?'prd':'qas')
}

def getFixedImageTag() {
    return (isDevelop())?'dev':(isRelease()?'qas':(isMaster())?'latest':'qas')
}

def isMaster() {
    return env.BRANCH_NAME == "master"
}

def isRelease() {
    return env.BRANCH_NAME == "release"
}

def isDevelop() {
    return env.BRANCH_NAME == "develop"
}

def getShortCommitId() {
    def gitCommit = env.GIT_COMMIT
    def shortGitCommit = "${gitCommit[0..6]}"
    return shortGitCommit
}

