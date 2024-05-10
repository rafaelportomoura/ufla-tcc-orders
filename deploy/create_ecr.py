from scripts.typescript import Typescript
from scripts.cloudformation import CloudFormation
from scripts.args import get_args
from stacks import ecr
from scripts.exception import DeployException
from scripts.docker import Docker

args = get_args(
    {
        "stage": {"type": "str", "required": False, "default": "prod"},
        "microservice": {"type": "str", "required": False, "default": "orders"},
        "tenant": {"type": "str", "required": False, "default": "tcc"},
        "region": {"type": "str", "required": False, "default": "us-east-2"},
        "profile": {"type": "str", "required": False, "default": "default"},
        "log_level": {"type": "int", "required": False, "default": 3},
        "account_id": {"type": "str", "required": True},
    }
)

microservice = args["microservice"]
stage = args["stage"]
tenant = args["tenant"]
region = args["region"]
profile = args["profile"]
log_level = args["log_level"]
account_id = args["account_id"]

cloudformation = CloudFormation(profile=profile, region=region, log_level=log_level)
docker = Docker(log_level=log_level)
typescript = Typescript(log_level=log_level)

################################################
# 🚀 ECR
################################################
ECR_STACK = ecr.stack(stage=stage, tenant=tenant, microservice=microservice)
cloudformation.deploy_stack(stack=ECR_STACK)

if not cloudformation.stack_is_succesfully_deployed(stack_name=ECR_STACK["stack_name"]):
    raise DeployException(stack=ECR_STACK)

ecr_uri = docker.ecr_uri(account_id=account_id, region=region)
typescript.build()
image=f"{stage}-{tenant}-{microservice}"
docker.build_and_push(ecr_uri=ecr_uri,region=region, image=image, tag="latest")