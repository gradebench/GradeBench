terraform {
  backend "s3" {
    bucket         = "gradebench-tf-state"
    key            = "env/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "gradebench-tf-lock"
  }
}
