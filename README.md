# Employee CRUD Application with Node.js, Docker, Kubernetes, and Monitoring

This repository contains a **Node.js Employee CRUD application** integrated with **PostgreSQL** and monitored using **Prometheus**, **Alertmanager**, and **Grafana**. The application is containerized using **Docker**, deployed on **Kubernetes (EKS)**, and managed using **Helm**. Continuous integration is handled with **Jenkins**, and infrastructure is provisioned using **Terraform**.


## Project Overview

This project demonstrates a full-stack DevOps workflow:

1. Node.js application with CRUD functionality for Employee data.  
2. PostgreSQL database for persistent storage.  
3. Containerization with Docker and multi-service orchestration with Docker Compose.  
4. CI/CD pipeline using Jenkins to build and push Docker images to Docker Hub.  
5. Infrastructure provisioning on AWS using Terraform (EKS + VPS).  
6. Deployment to Kubernetes using Helm charts.  
7. Monitoring using Prometheus, Alertmanager, and Grafana.  
8. Local development and testing using Minikube.  

---

## Application Features

- **Employee CRUD operations**:
  - Create, Read, Update, Delete employees.
  - Each employee has `name` and `address` fields.
- REST API endpoints for all CRUD operations.
- PostgreSQL used for database storage.

---
SETUP PROJECT:
--------------
Backend:
-------



`cd <path_to_project>/backend`

`npm install`

`npm start`

All Set Dockerfile + Docker Compose
===============================================================

Dockerfile:
--------

Defines the Node.js application image.

Copies source code and installs dependencies.

Exposes port 3000.

Docker Compose

## Services:

app → Node.js Employee CRUD application.

postgres → PostgreSQL database.

prometheus → Metrics collection.

alertmanager → Alert notifications.

grafana → Visualization dashboard.

### Running Docker Compose

`docker-compose up -d`

### Stop Docker Compose

`docker-compose down`

===============================================================
## Jenkins CI/CD Pipeline

Jenkins builds the Docker image for the Node.js app.

Pushes the image to Docker Hub.

Pipeline steps include:

npm install & build

Docker image creation

Docker Hub push

### AWS & Terraform Setup
## Installed and configured AWS CLI.
`aws configure'

SETUP INFA:
--------------

Created infrastructure using Terraform:

`cd <path_to_project>/eks-terraform`

`terraform init`

`terraform plan`

`terraform apply`


SETUP DEPLOYEMENT:
--------------

### EKS Cluster for Kubernetes deployment


## Created Helm charts for:

Employee CRUD application

PostgreSQL database

Installed Helm charts on EKS cluster:

`helm install employee-app ./employee`

`helm install db ./postgres`


SETUP MONITORING:
--------------

### Monitoring Setup

Prometheus → Collects application and database metrics.

Alertmanager → Sends alerts based on Prometheus rules.

Grafana → Visualizes metrics and creates dashboards.

All monitoring services are included in Docker Compose for local testing and deployed to Kubernetes in production.

Testing on Minikube

Minikube used for local Kubernetes testing.

Ensures Helm charts and Docker images work in a local cluster before deploying to AWS EKS.


### Access the URLs in Browser

## NodeJS App: 
# http://192.168.3.77:3000/

## Grafana: 
# http://192.168.3.77:3001/
user/pass: admin/admin

## Prometheus: 
# http://192.168.3.77:9090/

<img width="1231" height="556" alt="image" src="https://github.com/user-attachments/assets/c4f15a56-7a78-4632-aa8d-65819b921cc8" />


CONCLUSION
===============================================================

# This project demonstrates a complete DevOps workflow:

Node.js CRUD application with PostgreSQL

Dockerization and Docker Compose orchestration

CI/CD automation via Jenkins

Infrastructure as code using Terraform

Kubernetes deployment with Helm

Monitoring using Prometheus, Alertmanager, and Grafana

Local testing with Minikube before production deployment on AWS EKS
