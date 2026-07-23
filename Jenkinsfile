pipeline {
    agent {
        kubernetes {
            cloud('kubernetes-production')
            defaultContainer 'jenkins-agent'
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    agent: jenkins-agent
  namespace: jenkins
spec:
  serviceAccountName: jenkins-admin

  imagePullSecrets:
    - name: regcred

  volumes:
    - name: kaniko-secret
      secret:
        secretName: regcred
        items:
          - key: .dockerconfigjson
            path: config.json

  containers:
    - name: kaniko
      image: gcr.io/kaniko-project/executor:v1.24.0-debug
      tty: true
      command:
        - /busybox/cat
      volumeMounts:
        - name: kaniko-secret
          mountPath: /kaniko/.docker
      resources:
        limits:
          cpu: "2000m"
          memory: "4Gi"
          ephemeral-storage: "8Gi"
        requests:
          cpu: "1000m"
          memory: "3Gi"
          ephemeral-storage: "4Gi"

    - name: jenkins-agent
      image: 180526211356.dkr.ecr.eu-central-1.amazonaws.com/devops-agent:latest
      command:
        - cat
      tty: true
      resources:
        limits:
          cpu: "1000m"
          memory: "1Gi"
        requests:
          cpu: "100m"
          memory: "256Mi"
'''
        }
    }

    options {
        disableConcurrentBuilds()
    }

    environment {
        ECR_URL = "180526211356.dkr.ecr.eu-central-1.amazonaws.com"
        AWS_REGION = "eu-central-1"

        APP_NAME = "t2hub/prod-nizamy-landingpage"

        YAML_BRANCH = "main"
        YAML_REPO = "https://x-bitbucket-api-token-auth@bitbucket.org/t2pms/devops_repo.git"

        K8S_NAMESPACE = "prod-nizamy"
        YAML_DIR = "k8s-manifests/apps/prod-nizamy-cicd"

        DEPLOYMENT = "prod-nizamy-landingpage"
        DEPLOYMENT_YAML = "deployment.yaml"
    }

    stages {

        stage('Initialize') {
            steps {
                script {
                    if (env.BRANCH_NAME != "main") {
                        error("Only the 'main' branch can be deployed.")
                    }

                    env.IMAGE_TAG = env.GIT_COMMIT.take(7)

                    echo "========================================"
                    echo "Branch      : ${env.BRANCH_NAME}"
                    echo "Namespace   : ${env.K8S_NAMESPACE}"
                    echo "ManifestDir : ${env.YAML_DIR}"
                    echo "Deployment  : ${env.DEPLOYMENT}"
                    echo "Image       : ${env.ECR_URL}/${env.APP_NAME}:${env.IMAGE_TAG}"
                    echo "========================================"
                }
            }
        }

        stage('Build Docker Image') {
            environment {
                PATH = "/busybox:/kaniko:$PATH"
            }

            steps {
                container(name: 'kaniko', shell: '/busybox/sh') {
                    sh '''
                        /kaniko/executor \
                          --context=. \
                          --dockerfile=Dockerfile \
                          --destination=$ECR_URL/$APP_NAME:$IMAGE_TAG \
                          --snapshot-mode=time \
                          --use-new-run \
                          --cache=true \
                          --compressed-caching=false
                    '''
                }
            }
        }

        stage('Deploy To Kubernetes') {
            steps {
                container(name: 'jenkins-agent') {
                    script {
                        git(
                            branch: env.YAML_BRANCH,
                            credentialsId: 'bb-devops-sa',
                            url: env.YAML_REPO
                        )

                        sh """
                            sed -i 's|<TAG>|${env.IMAGE_TAG}|g' ${env.YAML_DIR}/${env.DEPLOYMENT_YAML}

                            kubectl apply -n ${env.K8S_NAMESPACE} -f ${env.YAML_DIR}

                            kubectl rollout status deployment/${env.DEPLOYMENT} \
                              -n ${env.K8S_NAMESPACE} \
                              --timeout=300s
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }

        success {
            echo "Deployment to ${K8S_NAMESPACE} completed successfully."
        }

        failure {
            echo "Deployment to ${K8S_NAMESPACE} failed."
        }
    }
}