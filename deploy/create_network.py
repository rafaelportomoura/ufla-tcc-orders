from scripts.typescript import Typescript
from scripts.cloudformation import CloudFormation
from scripts.args import get_args
from stacks import network
from scripts.exception import DeployException

args = get_args(
    {
        "stage": {"type": "str", "required": False, "default": "prod"},
        "microservice": {"type": "str", "required": False, "default": "orders"},
        "tenant": {"type": "str", "required": False, "default": "tcc"},
        "region": {"type": "str", "required": False, "default": "us-east-2"},
        "profile": {"type": "str", "required": False, "default": "default"},
        "log_level": {"type": "int", "required": False, "default": 3},
        "authorizer_result_ttl_in_seconds": {
            "type": "int",
            "required": False,
            "default": 300,
        },
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
typescript = Typescript(log_level=log_level)


################################################
# 🚀 NETWORK STACK
################################################
exports = cloudformation.list_exports()
listener_arn = cloudformation.get_export_value(exports=exports, name=f"{stage}-{tenant}-application-load-balancer-listener-arn")

CERTIFICATE_ARN = cloudformation.get_export_value(exports, f"{stage}-{tenant}-domain-certificate")
HOSTED_ZONE_ID = cloudformation.get_export_value(
    exports, f"{stage}-{tenant}-hosted-zone-id"
)
DOMAIN_NAME = cloudformation.get_export_value(exports, f"{stage}-{tenant}-domain-name")

NETWORK_STACK = network.stack(
    stage=stage,
    tenant=tenant,
    microservice=microservice,
    listener_arn=listener_arn,
    authorizer_result_ttl_in_seconds=args["authorizer_result_ttl_in_seconds"],
    log_level=args["log_level_compute"],
    certificate=CERTIFICATE_ARN,
    hosted_zone=HOSTED_ZONE_ID,
    domain_name=DOMAIN_NAME,
)

typescript.build()
typescript.lambda_packages()
cloudformation.package_and_deploy_stack(stack=NETWORK_STACK, output="stacks/output.yaml")

if not cloudformation.stack_is_succesfully_deployed(stack_name=NETWORK_STACK["stack_name"]):
    raise DeployException(stack=NETWORK_STACK)