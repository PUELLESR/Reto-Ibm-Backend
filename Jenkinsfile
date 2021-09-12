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
        stage ('Deploy') {

            steps {
                script {
                    def imageTag = "${IMAGE_TAG}"
                    def imageName = "${IMAGE_NAME}:${imageTag}"
                    def containerName = "container-ibm-backend"
                    def containerPort = 4000
                    def applicationName = "AppECS-ibm-backend-service-ibm-backend2"
                    def deploymentGroupName = "DgpECS-ibm-backend-service-ibm-backend2"
                    def taskDefinitionName = "td-ibm-backend"
                    

                    sh  "                                                                     \
                    sed -e 's;%REPO%;${imageName};g'\
                        -e 's;%ENVIRONMENT%;${ENVIRONMENT};g'\
                        -e 's;%UENVIRONMENT%;${ENVIRONMENT.toUpperCase()};g'\
                        -e 's;%CONTAINERNAME%;${containerName};g'\
                        -e 's;%CONTAINERPORT%;${containerPort};g'\
                        -e 's;%TASKDEFINITIONNAME%;${taskDefinitionName};g'\
                            aws/task-definition.json >\
                            aws/task-definition-${imageTag}.json\
                    "

                    sh "\$(aws ecr get-login --no-include-email --region ${AWS_REGION})"
                    
                        TASK_DEFINITION = sh (returnStdout: true, script:"                                                                     \
                            aws ecs register-task-definition --region ${AWS_REGION} --family ${taskDefinitionName}                \
                            --cli-input-json file://aws/task-definition-${imageTag}.json        \
                        ")
                    

                    TASK_DEFINITION_OBJECT = jsonParse(TASK_DEFINITION)

                    def content = "version: 0.0 \
                    \nResources: \
                    \n  - TargetService: \
                    \n      Type: AWS::ECS::Service \
                    \n      Properties: \
                    \n        TaskDefinition: \"${TASK_DEFINITION_OBJECT.taskDefinition.taskDefinitionArn}\" \
                    \n        LoadBalancerInfo: \
                    \n          ContainerName: \"${containerName}\" \
                    \n          ContainerPort: ${containerPort}"

                    DEPLOYMENT_ID = sh (returnStdout: true, script: "aws deploy create-deployment --application-name ${applicationName} --deployment-group-name ${deploymentGroupName} --revision \"revisionType='String',string={content='${content}'\"}  --region ${AWS_REGION}").trim()
                    DEPLOYMENT_OBJECT = jsonParse(DEPLOYMENT_ID)
                    echo "Deployment-object is => ${DEPLOYMENT_ID}"
                    echo "Deployment-Id is => ${DEPLOYMENT_OBJECT.deploymentId}"
                }
                timeout(time: 10, unit: 'MINUTES'){
                    awaitDeploymentCompletion("${DEPLOYMENT_OBJECT.deploymentId}")
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


