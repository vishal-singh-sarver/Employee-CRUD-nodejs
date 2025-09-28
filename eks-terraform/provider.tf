locals {
  region = "us-east-1"
  name   = "amonkincloud-cluster"
  vpc_cidr = "10.123.0.0/16"
  azs      = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.123.1.0/24", "10.123.2.0/24"]
  private_subnets = ["10.123.3.0/24", "10.123.4.0/24"]
  intra_subnets   = ["10.123.5.0/24", "10.123.6.0/24"]
  tags = {
    Example = local.name
  }
}

terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.62.0"   # stable AWS provider
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.32.0"   # latest stable
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
