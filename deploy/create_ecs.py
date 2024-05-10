from scripts.cloudformation import CloudFormation
from scripts.args import get_args
from stacks import ecs
from scripts.exception import DeployException
from scripts.ecs import ECS

args = get_args(
    {
        "stage": {"type": "str", "required": False, "default": "prod"},
        "microservice": {"type": "str", "required": False, "default": "orders"},
        "tenant": {"type": "str", "required": False, "default": "tcc"},
        "region": {"type": "str", "required": False, "default": "us-east-2"},
        "profile": {"type": "str", "required": False, "default": "default"},
        "log_level": {"type": "int", "required": False, "default": 3},
        "min_container": {"type": "int", "required": False, "default": 1},
        "max_container": {"type": "int", "required": True, "default": 1},
        "scale_out_cooldown": {"type": "int", "required": False, "default": 60},
        "scale_in_cooldown": {"type": "int", "required": False, "default": 60},
        "cpu_utilization": {"type": "int", "required": False, "default": 40},
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

################################################
# 🚀 ECS
################################################
exports = cloudformation.list_exports()
target = cloudformation.get_export_value(
    exports=exports, name=f"{stage}-{tenant}-{microservice}-target-group-arn"
)
IMAGES_DOMAIN_NAME = cloudformation.get_export_value(
    exports=exports, name=f"{stage}-{tenant}-images-domain-name"
)
IMAGES_BUCKET = cloudformation.get_export_value(
    exports=exports, name=f"{stage}-{tenant}-images-bucket"
)

ECS_STACK = ecs.stack(
    stage=stage,
    tenant=tenant,
    microservice=microservice,
    log_level=args["log_level_compute"],
    min_container=args["min_container"],
    max_container=args["max_container"],
    scale_out_cooldown=args["scale_out_cooldown"],
    scale_in_cooldown=args["scale_in_cooldown"],
    cpu_utilization=args["cpu_utilization"],
    target_group=target,
    images_url=f"https://{IMAGES_DOMAIN_NAME}",
    images_bucket=IMAGES_BUCKET
)

cloudformation.deploy_stack(stack=ECS_STACK)
ecs = ECS(profile=profile, region=region, log_level=log_level)
if not cloudformation.stack_is_succesfully_deployed(stack_name=ECS_STACK["stack_name"]):
    raise DeployException(stack=ECS_STACK)

stack_resources = cloudformation.describe_stack_resources(stack_name=ECS_STACK["stack_name"])
print(stack_resources)
for resource in stack_resources["StackResources"]:
    if resource["LogicalResourceId"] == "Service":
        service = resource["PhysicalResourceId"]
        break

ecs.force_new_deployment(cluster=f"{stage}-{tenant}-{microservice}-cluster",service=service)
