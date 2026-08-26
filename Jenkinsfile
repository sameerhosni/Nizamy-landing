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
        DB_CREDENTIAL_ID = "nizamy-database-url"
        DB_SECRET = "nizamy-database"
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

        stage('Prepare Deployment') {
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
                        """
                    }
                }
            }
        }

        stage('Migrate Production Database') {
            steps {
                container(name: 'jenkins-agent') {
                    withCredentials([
                        string(
                            credentialsId: env.DB_CREDENTIAL_ID,
                            variable: 'NIZAMY_DATABASE_URL'
                        )
                    ]) {
                        sh '''
                            set +x
                            kubectl create secret generic "$DB_SECRET" \
                              -n "$K8S_NAMESPACE" \
                              --from-literal=DATABASE_URL="$NIZAMY_DATABASE_URL" \
                              --dry-run=client -o yaml | kubectl apply -f -

                            MIGRATION_JOB="nizamy-db-migrate-$IMAGE_TAG"
                            kubectl delete job "$MIGRATION_JOB" \
                              -n "$K8S_NAMESPACE" \
                              --ignore-not-found=true \
                              --wait=true

                            cat > /tmp/nizamy-db-migration-job.yaml <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: $MIGRATION_JOB
  namespace: $K8S_NAMESPACE
spec:
  backoffLimit: 0
  activeDeadlineSeconds: 300
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      restartPolicy: Never
      imagePullSecrets:
        - name: regcred
      containers:
        - name: migrate
          image: $ECR_URL/$APP_NAME:$IMAGE_TAG
          command:
            - node
            - --enable-source-maps
            - dist/migrate.mjs
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: $DB_SECRET
                  key: DATABASE_URL
EOF

                            kubectl apply -f /tmp/nizamy-db-migration-job.yaml
                            if ! kubectl wait \
                              --for=condition=complete \
                              "job/$MIGRATION_JOB" \
                              -n "$K8S_NAMESPACE" \
                              --timeout=300s; then
                                kubectl logs \
                                  "job/$MIGRATION_JOB" \
                                  -n "$K8S_NAMESPACE" \
                                  --all-containers=true || true
                                exit 1
                            fi
                            kubectl logs \
                              "job/$MIGRATION_JOB" \
                              -n "$K8S_NAMESPACE" \
                              --all-containers=true
                        '''
                    }
                }
            }
        }

        stage('Deploy To Kubernetes') {
            steps {
                container(name: 'jenkins-agent') {
                    script {
                        sh """
                            PATCHED_YAML=\$(mktemp)
                            kubectl patch --local \
                              -f ${env.YAML_DIR}/${env.DEPLOYMENT_YAML} \
                              --type=strategic \
                              -p '{"spec":{"template":{"spec":{"containers":[{"name":"${env.DEPLOYMENT}","env":[{"name":"DATABASE_URL","valueFrom":{"secretKeyRef":{"name":"${env.DB_SECRET}","key":"DATABASE_URL"}}}]}]}}}}' \
                              -o yaml > "\$PATCHED_YAML"
                            mv "\$PATCHED_YAML" ${env.YAML_DIR}/${env.DEPLOYMENT_YAML}
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