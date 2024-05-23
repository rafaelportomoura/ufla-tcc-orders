from scripts.typescript import Typescript
from scripts.cloudformation import CloudFormation
from scripts.args import get_args
from stacks import email
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
        "log_level_compute": {"type": "str", "required": False, "default": "debug"},
    }
)

microservice = args["microservice"]
stage = args["stage"]
tenant = args["tenant"]
region = args["region"]
profile = args["profile"]
log_level = args["log_level"]

cloudformation = CloudFormation(profile=profile, region=region, log_level=log_level)
docker = Docker(log_level=log_level)
typescript = Typescript(log_level=log_level)

typescript.build(dev_install="pnpm install --silent")
typescript.lambda_packages()
################################################
# 🚀 EMAIL
################################################
EMAIL = email.stack(stage=stage, tenant=tenant, microservice=microservice, log_level=args["log_level_compute"],)
cloudformation.package_and_deploy_stack(stack=EMAIL, output="stacks/output.yaml")

if not cloudformation.stack_is_succesfully_deployed(stack_name=EMAIL["stack_name"]):
    raise DeployException(stack=EMAIL)
